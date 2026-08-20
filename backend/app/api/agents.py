import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import APIRouter, HTTPException, status
from io import BytesIO
from beanie import PydanticObjectId
from fastapi.responses import StreamingResponse

from app.core.config import settings
from app.core.pdf_export import (
    build_tailored_resume_pdf,
    detect_section_order,
    extract_achievements_from_raw_text,
    extract_languages_from_raw_text,
    extract_subtitle_from_raw_text,
)
from app.models.resume import Resume
from app.models.matched_job import MatchedJob
from app.models.tailored_resume import TailoredResume
from app.schemas.tailored_resume import (
    TailorResumeRequest,
    TailorResumeResponse,
    TailoredResumeContent,
    TailoredProjectSchema,
    SkillGroupSchema,
    LanguageSchema,
    OriginalResumeSnapshot,
    ExportResumePdfRequest,
)
from ai.agents.resume_tailor_agent import ResumeTailorAgent

router = APIRouter(prefix="/agents", tags=["Agents"])
tailor_agent = ResumeTailorAgent(groq_api_key=settings.GROQ_API_KEY)


@router.post("/tailor-resume", response_model=TailorResumeResponse)
async def tailor_resume(payload: TailorResumeRequest):
    try:
        resume_oid = PydanticObjectId(payload.resume_id)
        job_oid = PydanticObjectId(payload.job_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid resume_id or job_id format.")

    resume = await Resume.get(resume_oid)
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")

    job = await MatchedJob.get(job_oid)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Matched job not found.")

    if str(resume.user_id) != str(job.user_id):
        raise HTTPException(status_code=400, detail="Resume and job do not belong to the same user.")

    job_payload = {
        "title": job.title,
        "organization": job.organization,
        "key_skills": job.key_skills or [],
        "matching_skills": job.matching_skills or [],
        "requirements_summary": payload.job_description or job.requirements_summary or "",
        "core_responsibilities": job.core_responsibilities or "",
    }

    resume_payload = {
        "summary": resume.summary or "",
        "skills": resume.skills or [],
        "projects": resume.projects or [],
        "experience": resume.experience or [],
        "education": resume.education or [],
        "raw_text": resume.raw_text or "",
    }

    try:
        tailored = tailor_agent.tailor_resume(resume_payload, job_payload)
    except Exception as e:
        print(f"[AgentsAPI] Tailor resume failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to tailor resume: {str(e)}",
        )

    original_projects = [
        p if isinstance(p, dict) else {"title": str(p), "description": ""}
        for p in (resume.projects or [])
    ]
    raw_text = resume.raw_text or ""
    contact = resume.contact_info or {}
    section_order = detect_section_order(raw_text=raw_text)
    languages = extract_languages_from_raw_text(raw_text)
    achievements = extract_achievements_from_raw_text(raw_text)
    if not achievements and resume.volunteer_work:
        achievements = [
            (item.get("activity") if isinstance(item, dict) else str(item))
            for item in resume.volunteer_work
        ]
    subtitle = extract_subtitle_from_raw_text(raw_text, name=str(contact.get("name") or ""))

    document = TailoredResume(
        user_id=resume.user_id,
        resume_id=resume.id,
        job_id=job.id,
        job_title=job.title,
        organization=job.organization,
        original_summary=resume.summary or "",
        original_skills=resume.skills or [],
        original_projects=original_projects,
        tailored_summary=tailored.get("professional_summary") or "",
        tailored_skills=tailored.get("prioritized_skills") or [],
        skill_groups=tailored.get("skill_groups") or [],
        tailored_projects=tailored.get("projects") or [],
        highlighted_keywords=tailored.get("highlighted_keywords") or [],
        tailoring_notes=tailored.get("tailoring_notes") or "",
        contact_info=contact,
        education=resume.education or [],
        experience=resume.experience or [],
        certifications=resume.certifications or [],
        achievements=achievements or [],
        languages=languages or [],
        volunteer_work=resume.volunteer_work or [],
        section_order=section_order,
        subtitle=subtitle,
        raw_text=raw_text,
    )
    await document.insert()

    return _to_response(document)


@router.post("/export-resume-pdf")
async def export_resume_pdf(payload: ExportResumePdfRequest):
    try:
        data = payload.model_dump()
        # Ensure section order is always populated for mirroring
        if not data.get("section_order"):
            data["section_order"] = detect_section_order(raw_text=data.get("raw_text") or "")
        pdf_bytes = build_tailored_resume_pdf(data)
    except Exception as e:
        print(f"[AgentsAPI] PDF export failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF: {str(e)}",
        )

    buffer = BytesIO(pdf_bytes)
    headers = {
        "Content-Disposition": 'attachment; filename="Tailored_Resume.pdf"',
    }
    return StreamingResponse(buffer, media_type="application/pdf", headers=headers)


def _to_response(document: TailoredResume) -> TailorResumeResponse:
    projects = []
    for project in document.tailored_projects or []:
        projects.append(
            TailoredProjectSchema(
                title=project.get("title") or "",
                bullets=project.get("bullets") or [],
                description=project.get("description") or "",
            )
        )

    groups = []
    for group in document.skill_groups or []:
        groups.append(
            SkillGroupSchema(
                category=group.get("category") or "Technical Skills",
                skills=group.get("skills") or [],
            )
        )

    languages = []
    for lang in document.languages or []:
        if isinstance(lang, dict):
            languages.append(
                LanguageSchema(
                    language=lang.get("language") or lang.get("name") or "",
                    proficiency=lang.get("proficiency") or lang.get("level") or "",
                )
            )

    return TailorResumeResponse(
        id=str(document.id),
        resume_id=str(document.resume_id),
        job_id=str(document.job_id),
        job_title=document.job_title,
        organization=document.organization,
        original=OriginalResumeSnapshot(
            summary=document.original_summary or "",
            skills=document.original_skills or [],
            projects=document.original_projects or [],
        ),
        tailored=TailoredResumeContent(
            professional_summary=document.tailored_summary or "",
            prioritized_skills=document.tailored_skills or [],
            skill_groups=groups,
            projects=projects,
            highlighted_keywords=document.highlighted_keywords or [],
            tailoring_notes=document.tailoring_notes or "",
        ),
        contact_info=document.contact_info or {},
        education=document.education or [],
        experience=document.experience or [],
        certifications=document.certifications or [],
        achievements=document.achievements or [],
        languages=languages,
        volunteer_work=document.volunteer_work or [],
        section_order=document.section_order or [],
        subtitle=document.subtitle or "",
        raw_text=document.raw_text or "",
        created_at=document.created_at,
    )
