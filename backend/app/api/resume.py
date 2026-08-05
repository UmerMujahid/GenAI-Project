import sys
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
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    try:
        contents = await file.read()
        parsed_data = resume_agent.parse_resume(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse PDF resume with AI Agent: {str(e)}"
        )

    resume = Resume(
        user_id=PydanticObjectId(user_id),
        filename=file.filename,
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
