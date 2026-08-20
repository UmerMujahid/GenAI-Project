"""Resume upload and retrieval API routes.

Accepts PDF uploads, deduplicates by content hash, and persists structured
profiles produced by ``ResumeParserAgent``.
"""

import sys
import hashlib
from pathlib import Path

# Ensure project root is in sys.path so top-level packages like 'ai' can be imported
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from beanie import PydanticObjectId
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse
from app.core.config import settings
from ai.agents.resume_parser_agent import ResumeParserAgent

router = APIRouter(prefix="/resume", tags=["Resume"])
resume_agent = ResumeParserAgent(groq_api_key=settings.GROQ_API_KEY)


@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(user_id: str, file: UploadFile = File(...)):
    """Upload a PDF resume, parse it with the AI agent, and store the result.

    Args:
        user_id: MongoDB ObjectId string of the owning user.
        file: Uploaded PDF file.

    Returns:
        ResumeResponse: Parsed resume document (existing duplicate or newly inserted).

    Raises:
        HTTPException: On invalid file type, empty upload, bad user id, or parse failure.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    try:
        obj_id = PydanticObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        file_hash = hashlib.sha256(contents).hexdigest()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}"
        )

    # 1. Check if an identical resume was already parsed for this user (by hash or filename)
    existing_resume = await Resume.find_one(Resume.user_id == obj_id, Resume.file_hash == file_hash)
    if not existing_resume:
        existing_resume = await Resume.find_one(Resume.user_id == obj_id, Resume.filename == file.filename)

    if existing_resume:
        print(f"[ResumeAPI] Duplicate resume found for user {user_id} (hash: {file_hash[:10]} / file: {file.filename}). Returning existing profile.")
        if not existing_resume.file_hash:
            existing_resume.file_hash = file_hash
            await existing_resume.save()

        return ResumeResponse(
            id=str(existing_resume.id),
            user_id=str(existing_resume.user_id),
            filename=existing_resume.filename,
            summary=existing_resume.summary or "",
            parser_mode=existing_resume.parser_mode or "LLM Agent",
            contact_info=existing_resume.contact_info or {},
            skills=existing_resume.skills or [],
            education=existing_resume.education or [],
            experience=existing_resume.experience or [],
            projects=existing_resume.projects or [],
            certifications=existing_resume.certifications or [],
            volunteer_work=existing_resume.volunteer_work or [],
            raw_text=existing_resume.raw_text or "",
            created_at=existing_resume.created_at
        )

    # 2. If new resume, parse with AI Agent
    try:
        parsed_data = resume_agent.parse_resume(contents)
    except Exception as e:
        print(f"[ResumeAPI] Resume parsing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse PDF resume: {str(e)}"
        )

    resume = Resume(
        user_id=obj_id,
        filename=file.filename,
        file_hash=file_hash,
        raw_text=parsed_data.get("raw_text", ""),
        summary=parsed_data.get("summary", ""),
        parser_mode=parsed_data.get("parser_mode", "LLM Agent"),
        contact_info=parsed_data.get("contact_info", {}),
        skills=parsed_data.get("skills", []),
        education=parsed_data.get("education", []),
        experience=parsed_data.get("experience", []),
        projects=parsed_data.get("projects", []),
        certifications=parsed_data.get("certifications", []),
        volunteer_work=parsed_data.get("volunteer_work", [])
    )
    await resume.insert()

    return ResumeResponse(
        id=str(resume.id),
        user_id=str(resume.user_id),
        filename=resume.filename,
        summary=resume.summary,
        parser_mode=resume.parser_mode,
        contact_info=resume.contact_info,
        skills=resume.skills,
        education=resume.education,
        experience=resume.experience,
        projects=resume.projects,
        certifications=resume.certifications,
        volunteer_work=resume.volunteer_work,
        raw_text=resume.raw_text,
        created_at=resume.created_at
    )


@router.get("/user/{user_id}", response_model=Optional[ResumeResponse])
async def get_latest_resume(user_id: str):
    """Fetch the most recently uploaded resume for a user.

    Args:
        user_id: MongoDB ObjectId string of the owning user.

    Returns:
        Optional[ResumeResponse]: Latest resume, or ``None`` if none exists.

    Raises:
        HTTPException: If ``user_id`` is malformed or the query fails.
    """
    try:
        obj_id = PydanticObjectId(user_id)
        resume = await Resume.find_one(Resume.user_id == obj_id, sort=[("created_at", -1)])
        if not resume:
            return None
        return ResumeResponse(
            id=str(resume.id),
            user_id=str(resume.user_id),
            filename=resume.filename,
            summary=resume.summary or "",
            parser_mode=resume.parser_mode or "LLM Agent",
            contact_info=resume.contact_info or {},
            skills=resume.skills or [],
            education=resume.education or [],
            experience=resume.experience or [],
            projects=resume.projects or [],
            certifications=resume.certifications or [],
            volunteer_work=resume.volunteer_work or [],
            raw_text=resume.raw_text or "",
            created_at=resume.created_at
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
