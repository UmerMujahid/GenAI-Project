"""Agent API routers for resume tailoring and cover letter generation.

Exposes FastAPI endpoints that orchestrate LangChain/Groq agents, persist
results in MongoDB via Beanie, and stream ReportLab PDF exports to clients.
"""

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
    build_cover_letter_pdf,
    detect_section_order,
    extract_achievements_from_raw_text,
    extract_languages_from_raw_text,
    extract_subtitle_from_raw_text,
    safe_filename_fragment,
)
from app.models.resume import Resume
from app.models.matched_job import MatchedJob
from app.models.tailored_resume import TailoredResume
from app.models.cover_letter import CoverLetter
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
from app.schemas.cover_letter import (
    GenerateCoverLetterRequest,
    GenerateCoverLetterResponse,
    ExportCoverLetterPdfRequest,
    CoverLetterHeader,
)
from ai.agents.resume_tailor_agent import ResumeTailorAgent
from ai.agents.cover_letter_agent import CoverLetterAgent

router = APIRouter(prefix="/agents", tags=["Agents"])
tailor_agent = ResumeTailorAgent(groq_api_key=settings.GROQ_API_KEY)
cover_letter_agent = CoverLetterAgent(groq_api_key=settings.GROQ_API_KEY)


@router.post("/tailor-resume", response_model=TailorResumeResponse)
async def tailor_resume(payload: TailorResumeRequest):
    """Rewrite a stored resume for a specific matched job using Groq.

    Args:
        payload: Request containing ``resume_id`` and ``job_id``.

    Returns:
        TailorResumeResponse: Original vs tailored resume snapshot persisted in MongoDB.

    Raises:
        HTTPException: If IDs are invalid, documents are missing, or generation fails.
    """
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
        # Invoke LangChain + Groq tailor agent (falls back to heuristic if LLM fails)
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
    # Preserve original resume section sequence for PDF mirroring
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
    """Generate a tailored resume PDF and return it as a file download.

    Args:
        payload: Structured tailored resume content for ReportLab rendering.

    Returns:
        StreamingResponse: ``application/pdf`` attachment named ``Tailored_Resume.pdf``.
    """
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


@router.post("/generate-cover-letter", response_model=GenerateCoverLetterResponse)
async def generate_cover_letter(payload: GenerateCoverLetterRequest):
    """Draft a 3-paragraph cover letter for a resume/job pair.

    When ``use_tailored`` is true, prefers the latest tailored resume variant
    for the same resume/job (or resume) before falling back to the original.

    Args:
        payload: ``resume_id``, ``job_id``, optional ``company_name``, ``use_tailored``.

    Returns:
        GenerateCoverLetterResponse: Persisted cover letter JSON including ``full_text``.
    """
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

    company_name = (payload.company_name or job.organization or "").strip()
    tailored_doc = None
    use_tailored = bool(payload.use_tailored)

    if use_tailored:
        # Prefer job-specific tailored resume; otherwise latest tailored for this resume
        tailored_doc = await TailoredResume.find_one(
            TailoredResume.resume_id == resume.id,
            TailoredResume.job_id == job.id,
            sort=[("created_at", -1)],
        )
        if not tailored_doc:
            tailored_doc = await TailoredResume.find_one(
                TailoredResume.resume_id == resume.id,
                sort=[("created_at", -1)],
            )

    if tailored_doc:
        candidate = {
            "contact_info": tailored_doc.contact_info or resume.contact_info or {},
            "summary": tailored_doc.tailored_summary or resume.summary or "",
            "skills": tailored_doc.tailored_skills or resume.skills or [],
            "projects": tailored_doc.tailored_projects or resume.projects or [],
            "experience": tailored_doc.experience or resume.experience or [],
        }
        use_tailored = True
    else:
        candidate = {
            "contact_info": resume.contact_info or {},
            "summary": resume.summary or "",
            "skills": resume.skills or [],
            "projects": resume.projects or [],
            "experience": resume.experience or [],
        }
        use_tailored = False

    job_payload = {
        "title": job.title,
        "organization": company_name or job.organization,
        "key_skills": job.key_skills or [],
        "requirements_summary": job.requirements_summary or "",
        "core_responsibilities": job.core_responsibilities or "",
    }

    try:
        generated = cover_letter_agent.generate_cover_letter(
            candidate=candidate,
            job=job_payload,
            company_name=company_name or job.organization,
        )
    except Exception as e:
        print(f"[AgentsAPI] Cover letter generation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate cover letter: {str(e)}",
        )

    document = CoverLetter(
        user_id=resume.user_id,
        resume_id=resume.id,
        job_id=job.id,
        tailored_resume_id=tailored_doc.id if tailored_doc else None,
        job_title=job.title,
        company_name=company_name or job.organization,
        use_tailored=use_tailored,
        header=generated.get("header") or {},
        salutation=generated.get("salutation") or "Dear Hiring Manager,",
        body_paragraphs=generated.get("body_paragraphs") or [],
        closing=generated.get("closing") or "Sincerely,",
        candidate_name=generated.get("candidate_name") or "",
    )
    await document.insert()
    return _cover_letter_response(document)


@router.post("/export-cover-letter-pdf")
async def export_cover_letter_pdf(payload: ExportCoverLetterPdfRequest):
    """Render a cover letter PDF with a clean contact header.

    Args:
        payload: Cover letter header, salutation, body paragraphs, and closing.

    Returns:
        StreamingResponse: PDF attachment named ``Cover_Letter_[Company].pdf``.
    """
    try:
        pdf_bytes = build_cover_letter_pdf(payload.model_dump())
    except Exception as e:
        print(f"[AgentsAPI] Cover letter PDF export failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate cover letter PDF: {str(e)}",
        )

    company_slug = safe_filename_fragment(payload.company_name or "Company")
    buffer = BytesIO(pdf_bytes)
    headers = {
        "Content-Disposition": f'attachment; filename="Cover_Letter_{company_slug}.pdf"',
    }
    return StreamingResponse(buffer, media_type="application/pdf", headers=headers)


def _cover_letter_response(document: CoverLetter) -> GenerateCoverLetterResponse:
    """Map a CoverLetter Beanie document to the API response schema."""
    header = document.header or {}
    paragraphs = document.body_paragraphs or []
    full_text = "\n\n".join(
        [
            document.salutation or "",
            *paragraphs,
            document.closing or "",
            document.candidate_name or header.get("candidate_name") or "",
        ]
    ).strip()

    return GenerateCoverLetterResponse(
        id=str(document.id),
        resume_id=str(document.resume_id),
        job_id=str(document.job_id),
        job_title=document.job_title,
        company_name=document.company_name,
        use_tailored=bool(document.use_tailored),
        header=CoverLetterHeader(
            candidate_name=header.get("candidate_name") or document.candidate_name or "",
            email=header.get("email") or "",
            phone=header.get("phone") or "",
            location=header.get("location") or "",
            github=header.get("github") or "",
            linkedin=header.get("linkedin") or "",
        ),
        salutation=document.salutation or "Dear Hiring Manager,",
        body_paragraphs=paragraphs,
        closing=document.closing or "Sincerely,",
        candidate_name=document.candidate_name or header.get("candidate_name") or "",
        full_text=full_text,
        created_at=document.created_at,
    )


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
