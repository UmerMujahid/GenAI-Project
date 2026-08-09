import sys
from pathlib import Path

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


@router.post("/discover/{user_id}", response_model=List[MatchedJobResponse])
async def discover_jobs(user_id: str):
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

    resume_data = {
        "skills": resume.skills or [],
        "role_preference": (resume.contact_info or {}).get("name", "Software Developer"),
        "city": (resume.contact_info or {}).get("location", "Pakistan"),
        "summary": resume.summary or ""
    }

    loop = asyncio.get_event_loop()
    matched_jobs = await loop.run_in_executor(
        None,
        lambda: asyncio.run(job_agent.discover_jobs(resume_data, max_results=3))
    )

    if not matched_jobs:
        return []

    # Clear old matches for this user
    await MatchedJob.find(MatchedJob.user_id == obj_id).delete()

    saved_jobs = []
    for job_data in matched_jobs:
        matched_job = MatchedJob(
            user_id=obj_id,
            job_api_id=job_data.get("job_api_id"),
            title=job_data.get("title") or "",
            organization=job_data.get("organization") or "",
            organization_url=job_data.get("organization_url") or "",
            apply_url=job_data.get("apply_url") or "",
            date_posted=job_data.get("date_posted"),
            employment_type=job_data.get("employment_type") or [],
            salary_currency=job_data.get("salary_currency") or "USD",
            salary_min=job_data.get("salary_min"),
            salary_max=job_data.get("salary_max"),
            salary_unit=job_data.get("salary_unit") or "YEAR",
            work_arrangement=job_data.get("work_arrangement"),
            experience_level=job_data.get("experience_level"),
            education=job_data.get("education") or [],
            visa_sponsorship=bool(job_data.get("visa_sponsorship", False)),
            key_skills=job_data.get("key_skills") or [],
            core_responsibilities=job_data.get("core_responsibilities") or "",
            requirements_summary=job_data.get("requirements_summary") or "",
            benefits=job_data.get("benefits") or [],
            match_score=float(job_data.get("match_score") or 0.0),
            matching_skills=job_data.get("matching_skills") or [],
            missing_skills=job_data.get("missing_skills") or [],
            reasoning=job_data.get("reasoning") or "",
            source_platform=job_data.get("source_platform") or "Active Jobs DB"
        )
        await matched_job.insert()

        saved_jobs.append(MatchedJobResponse(
            id=str(matched_job.id),
            user_id=str(matched_job.user_id),
            job_api_id=matched_job.job_api_id,
            title=matched_job.title,
            organization=matched_job.organization,
            organization_url=matched_job.organization_url,
            apply_url=matched_job.apply_url,
            date_posted=matched_job.date_posted,
            employment_type=matched_job.employment_type,
            salary_currency=matched_job.salary_currency,
            salary_min=matched_job.salary_min,
            salary_max=matched_job.salary_max,
            salary_unit=matched_job.salary_unit,
            work_arrangement=matched_job.work_arrangement,
            experience_level=matched_job.experience_level,
            education=matched_job.education,
            visa_sponsorship=matched_job.visa_sponsorship,
            key_skills=matched_job.key_skills,
            core_responsibilities=matched_job.core_responsibilities,
            requirements_summary=matched_job.requirements_summary,
            benefits=matched_job.benefits,
            match_score=matched_job.match_score,
            matching_skills=matched_job.matching_skills,
            missing_skills=matched_job.missing_skills,
            reasoning=matched_job.reasoning,
            source_platform=matched_job.source_platform,
            discovered_at=matched_job.discovered_at
        ))

    return saved_jobs


@router.get("/matched/{user_id}", response_model=List[MatchedJobResponse])
async def get_matched_jobs(user_id: str):
    try:
        obj_id = PydanticObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    jobs = await MatchedJob.find(
        MatchedJob.user_id == obj_id
    ).sort("-match_score").to_list()

    return [
        MatchedJobResponse(
            id=str(job.id),
            user_id=str(job.user_id),
            job_api_id=job.job_api_id,
            title=job.title,
            organization=job.organization,
            organization_url=job.organization_url,
            apply_url=job.apply_url,
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
        )
        for job in jobs
    ]
