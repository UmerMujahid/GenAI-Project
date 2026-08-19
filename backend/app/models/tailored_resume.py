from datetime import datetime
from typing import Any, Dict, List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field


class TailoredResume(Document):
    user_id: PydanticObjectId
    resume_id: PydanticObjectId
    job_id: PydanticObjectId
    job_title: str = ""
    organization: str = ""

    original_summary: Optional[str] = ""
    original_skills: List[str] = Field(default_factory=list)
    original_projects: List[Dict[str, Any]] = Field(default_factory=list)

    tailored_summary: str = ""
    tailored_skills: List[str] = Field(default_factory=list)
    skill_groups: List[Dict[str, Any]] = Field(default_factory=list)
    tailored_projects: List[Dict[str, Any]] = Field(default_factory=list)
    highlighted_keywords: List[str] = Field(default_factory=list)
    tailoring_notes: Optional[str] = ""

    contact_info: Optional[Dict[str, Any]] = Field(default_factory=dict)
    education: List[Dict[str, Any]] = Field(default_factory=list)
    experience: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "tailored_resumes"
