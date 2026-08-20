"""Job discovery and matched-job retrieval API routes.

Orchestrates ``JobDiscoveryAgent`` (JobSpy + Groq scoring) and persists
``MatchedJob`` documents for authenticated dashboard clients.
"""

import sys
from pathlib import Path
import urllib.parse

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import asyncio
from typing import List
from fastapi import APIRouter, HTTPException, status
from beanie import PydanticObjectId
from app.models.resume import Resume
from app.models.matched_job import MatchedJob
from app.schemas.matched_job import MatchedJobResponse
from app.core.config import settings
from ai.agents.job_discovery_agent import JobDiscoveryAgent

router = APIRouter(prefix="/jobs", tags=["Jobs"])
job_agent = JobDiscoveryAgent(
    groq_api_key=settings.GROQ_API_KEY,
    rapidapi_key=settings.RAPIDAPI_KEY
)


def _clean_apply_url(apply_url: str, title: str, org: str) -> str:
    """Normalize apply links to absolute HTTP(S) URLs.

    Args:
        apply_url: Raw URL from the scraper (may be empty or ``nan``).
        title: Job title used when building a Google search fallback.
        org: Organization name used in the fallback search query.

    Returns:
        str: A valid absolute apply URL or Google Jobs search fallback.
    """
    if not apply_url or str(apply_url).strip().lower() in ["nan", "none", "null", "undefined", ""]:
        search_query = f"{title} {org} jobs Pakistan"
        return f"https://www.google.com/search?q={urllib.parse.quote(search_query)}"
    
    url = str(apply_url).strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        return f"https://{url}"
    return url


def _determine_target_role(skills: list, summary: str) -> str:
    """Infer a target role label from resume skills and summary text.

    Args:
        skills: Candidate skill strings.
        summary: Professional summary used for keyword hints.

    Returns:
        str: Human-readable target role used in job search queries.
    """
    skills_lower = [s.lower() for s in skills]
    skills_text = " ".join(skills_lower) + " " + summary.lower()

    if any(k in skills_text for k in ["ai", "machine learning", "deep learning", "pytorch", "tensorflow", "nlp"]):
        return "AI Machine Learning Engineer"
    elif any(k in skills_text for k in ["react", "frontend", "next.js", "tailwind", "vue", "angular", "html/css"]):
        return "Frontend React Developer"
    elif any(k in skills_text for k in ["python", "django", "fastapi", "flask"]):
        return "Python Backend Developer"
    elif any(k in skills_text for k in ["flutter", "react native", "android", "ios", "swift", "kotlin"]):
        return "Mobile App Developer"
    elif any(k in skills_text for k in ["node", "express", "backend", "springboot", "golang", ".net"]):
        return "Backend Developer"
    elif any(k in skills_text for k in ["qa", "sqa", "selenium", "cypress", "quality assurance", "testing"]):
        return "SQA Engineer"
    elif any(k in skills_text for k in ["data analyst", "power bi", "tableau", "pandas", "data science"]):
        return "Data Analyst"
    
    return "Software Engineer"


@router.post("/discover/{user_id}", response_model=List[MatchedJobResponse])
async def discover_jobs(user_id: str):
    """Run live job discovery for a user and persist matched results.

    Args:
        user_id: MongoDB ObjectId string of the candidate.

    Returns:
        List[MatchedJobResponse]: Newly discovered and scored job matches.

    Raises:
        HTTPException: If the user id is invalid, no resume exists, or discovery fails.
    """
    try:
        obj_id = PydanticObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    resume = await Resume.find_one(Resume.user_id == obj_id, sort=[("created_at", -1)])
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume found. Please upload a resume first."
        )

    skills = resume.skills or []
    summary = resume.summary or ""
    target_role = _determine_target_role(skills, summary)
    location = (resume.contact_info or {}).get("location", "Pakistan")

    resume_data = {
        "skills": skills,
        "role_preference": target_role,
        "city": location if location and "not" not in location.lower() else "Pakistan",
        "summary": summary
    }

    loop = asyncio.get_event_loop()
    matched_jobs = await loop.run_in_executor(
        None,
        lambda: asyncio.run(job_agent.discover_jobs(resume_data, max_results=5))
    )

    if not matched_jobs:
        return []

    # Clean up any legacy low-quality / non-tech jobs for this user in MongoDB (< 35% fit)
    await MatchedJob.find(
        MatchedJob.user_id == obj_id,
        MatchedJob.match_score < 35.0
    ).delete()

    # Upsert high-quality matched jobs
    saved_responses = []
    for job_data in matched_jobs:
        match_score = float(job_data.get("match_score") or 0.0)
        if match_score < 35.0:
            continue

        title = job_data.get("title") or ""
        organization = job_data.get("organization") or ""
        raw_apply = job_data.get("apply_url") or ""
        apply_url = _clean_apply_url(raw_apply, title, organization)
        org_url = _clean_apply_url(job_data.get("organization_url") or "", title, organization) if job_data.get("organization_url") else ""

        # Check if identical job posting already exists for this user (matched by user + apply_url or user + title + organization)
        existing_job = None
        if apply_url and not apply_url.startswith("https://www.google.com/search"):
            existing_job = await MatchedJob.find_one(
                MatchedJob.user_id == obj_id,
                MatchedJob.apply_url == apply_url
            )
        if not existing_job and title and organization:
            existing_job = await MatchedJob.find_one(
                MatchedJob.user_id == obj_id,
                MatchedJob.title == title,
                MatchedJob.organization == organization
            )

        if existing_job:
            existing_job.apply_url = apply_url
            existing_job.match_score = match_score
            existing_job.matching_skills = job_data.get("matching_skills") or existing_job.matching_skills
            existing_job.missing_skills = job_data.get("missing_skills") or existing_job.missing_skills
            existing_job.reasoning = job_data.get("reasoning") or existing_job.reasoning
            existing_job.experience_level = job_data.get("experience_level") or existing_job.experience_level
            existing_job.work_arrangement = job_data.get("work_arrangement") or existing_job.work_arrangement
            await existing_job.save()
            target_doc = existing_job
        else:
            new_job = MatchedJob(
                user_id=obj_id,
                job_api_id=job_data.get("job_api_id"),
                title=title,
                organization=organization,
                organization_url=org_url,
                apply_url=apply_url,
                date_posted=job_data.get("date_posted"),
                employment_type=job_data.get("employment_type") or ["Full Time"],
                salary_currency=job_data.get("salary_currency") or "PKR",
                salary_min=job_data.get("salary_min"),
                salary_max=job_data.get("salary_max"),
                salary_unit=job_data.get("salary_unit") or "MONTH",
                work_arrangement=job_data.get("work_arrangement"),
                experience_level=job_data.get("experience_level") or "Not specified",
                education=job_data.get("education") or [],
                visa_sponsorship=bool(job_data.get("visa_sponsorship", False)),
                key_skills=job_data.get("key_skills") or [],
                core_responsibilities=job_data.get("core_responsibilities") or "",
                requirements_summary=job_data.get("requirements_summary") or "",
                benefits=job_data.get("benefits") or [],
                match_score=match_score,
                matching_skills=job_data.get("matching_skills") or [],
                missing_skills=job_data.get("missing_skills") or [],
                reasoning=job_data.get("reasoning") or "",
                source_platform=job_data.get("source_platform") or "JobSpy"
            )
            await new_job.insert()
            target_doc = new_job

        saved_responses.append(MatchedJobResponse(
            id=str(target_doc.id),
            user_id=str(target_doc.user_id),
            job_api_id=target_doc.job_api_id,
            title=target_doc.title,
            organization=target_doc.organization,
            organization_url=target_doc.organization_url,
            apply_url=target_doc.apply_url,
            date_posted=target_doc.date_posted,
            employment_type=target_doc.employment_type,
            salary_currency=target_doc.salary_currency,
            salary_min=target_doc.salary_min,
            salary_max=target_doc.salary_max,
            salary_unit=target_doc.salary_unit,
            work_arrangement=target_doc.work_arrangement,
            experience_level=target_doc.experience_level,
            education=target_doc.education,
            visa_sponsorship=target_doc.visa_sponsorship,
            key_skills=target_doc.key_skills,
            core_responsibilities=target_doc.core_responsibilities,
            requirements_summary=target_doc.requirements_summary,
            benefits=target_doc.benefits,
            match_score=target_doc.match_score,
            matching_skills=target_doc.matching_skills,
            missing_skills=target_doc.missing_skills,
            reasoning=target_doc.reasoning,
            source_platform=target_doc.source_platform,
            discovered_at=target_doc.discovered_at
        ))

    return saved_responses


@router.get("/matched/{user_id}", response_model=List[MatchedJobResponse])
async def get_matched_jobs(user_id: str):
    """Return previously persisted matched jobs for a user.

    Args:
        user_id: MongoDB ObjectId string of the candidate.

    Returns:
        List[MatchedJobResponse]: Stored matches sorted by score.

    Raises:
        HTTPException: If the user id is invalid.
    """
    try:
        obj_id = PydanticObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    # Only return relevant jobs scoring at least 35% fit
    jobs = await MatchedJob.find(
        MatchedJob.user_id == obj_id,
        MatchedJob.match_score >= 35.0
    ).sort("-match_score").to_list()

    cleaned_responses = []
    for job in jobs:
        clean_url = _clean_apply_url(job.apply_url, job.title, job.organization)
        if job.apply_url != clean_url:
            job.apply_url = clean_url
            await job.save()

        cleaned_responses.append(MatchedJobResponse(
            id=str(job.id),
            user_id=str(job.user_id),
            job_api_id=job.job_api_id,
            title=job.title,
            organization=job.organization,
            organization_url=job.organization_url,
            apply_url=clean_url,
            date_posted=job.date_posted,
            employment_type=job.employment_type,
            salary_currency=job.salary_currency,
            salary_min=job.salary_min,
            salary_max=job.salary_max,
            salary_unit=job.salary_unit,
            work_arrangement=job.work_arrangement,
            experience_level=job.experience_level,
            education=job.education,
            visa_sponsorship=job.visa_sponsorship,
            key_skills=job.key_skills,
            core_responsibilities=job.core_responsibilities,
            requirements_summary=job.requirements_summary,
            benefits=job.benefits,
            match_score=job.match_score,
            matching_skills=job.matching_skills,
            missing_skills=job.missing_skills,
            reasoning=job.reasoning,
            source_platform=job.source_platform,
            discovered_at=job.discovered_at
        ))

    return cleaned_responses
