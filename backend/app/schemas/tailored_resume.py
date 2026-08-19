from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class TailorResumeRequest(BaseModel):
    resume_id: str
    job_id: str
    job_description: Optional[str] = None


class TailoredProjectSchema(BaseModel):
    title: str = ""
    bullets: List[str] = Field(default_factory=list)
    description: Optional[str] = ""


class SkillGroupSchema(BaseModel):
    category: str = "Technical Skills"
    skills: List[str] = Field(default_factory=list)


class OriginalResumeSnapshot(BaseModel):
    summary: Optional[str] = ""
    skills: List[str] = Field(default_factory=list)
    projects: List[Dict[str, Any]] = Field(default_factory=list)


class TailoredResumeContent(BaseModel):
    professional_summary: str = ""
    prioritized_skills: List[str] = Field(default_factory=list)
    skill_groups: List[SkillGroupSchema] = Field(default_factory=list)
    projects: List[TailoredProjectSchema] = Field(default_factory=list)
    highlighted_keywords: List[str] = Field(default_factory=list)
    tailoring_notes: Optional[str] = ""


class TailorResumeResponse(BaseModel):
    id: str
    resume_id: str
    job_id: str
    job_title: str
    organization: str
    original: OriginalResumeSnapshot
    tailored: TailoredResumeContent
    contact_info: Dict[str, Any] = Field(default_factory=dict)
    education: List[Dict[str, Any]] = Field(default_factory=list)
    experience: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    created_at: datetime


class ExportResumePdfRequest(BaseModel):
    job_title: Optional[str] = ""
    organization: Optional[str] = ""
    contact_info: Dict[str, Any] = Field(default_factory=dict)
    professional_summary: str = ""
    prioritized_skills: List[str] = Field(default_factory=list)
    skill_groups: List[SkillGroupSchema] = Field(default_factory=list)
    projects: List[TailoredProjectSchema] = Field(default_factory=list)
    education: List[Dict[str, Any]] = Field(default_factory=list)
    experience: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
