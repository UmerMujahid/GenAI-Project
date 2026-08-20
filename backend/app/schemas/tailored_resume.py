"""Pydantic schemas for tailored resume generation and PDF export payloads."""

from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field


class TailorResumeRequest(BaseModel):
    """Request body for ``POST /api/agents/tailor-resume``."""

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


class LanguageSchema(BaseModel):
    language: str = ""
    proficiency: str = ""


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
    certifications: List[Union[str, Dict[str, Any]]] = Field(default_factory=list)
    achievements: List[Union[str, Dict[str, Any]]] = Field(default_factory=list)
    languages: List[LanguageSchema] = Field(default_factory=list)
    volunteer_work: List[Dict[str, Any]] = Field(default_factory=list)
    section_order: List[str] = Field(default_factory=list)
    subtitle: Optional[str] = ""
    raw_text: Optional[str] = ""
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
    certifications: List[Union[str, Dict[str, Any]]] = Field(default_factory=list)
    achievements: List[Union[str, Dict[str, Any]]] = Field(default_factory=list)
    languages: List[Union[LanguageSchema, Dict[str, Any], str]] = Field(default_factory=list)
    volunteer_work: List[Dict[str, Any]] = Field(default_factory=list)
    section_order: List[str] = Field(default_factory=list)
    subtitle: Optional[str] = ""
    raw_text: Optional[str] = ""
    summary: Optional[str] = ""
    skills: List[str] = Field(default_factory=list)
