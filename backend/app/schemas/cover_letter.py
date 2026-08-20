"""Pydantic schemas for cover letter generation and PDF export payloads."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class CoverLetterHeader(BaseModel):
    """Contact header fields rendered at the top of a cover letter."""

    candidate_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    github: str = ""
    linkedin: str = ""


class GenerateCoverLetterRequest(BaseModel):
    """Request body for ``POST /api/agents/generate-cover-letter``."""

    resume_id: str
    job_id: str
    company_name: Optional[str] = ""
    use_tailored: bool = True


class GenerateCoverLetterResponse(BaseModel):
    id: str
    resume_id: str
    job_id: str
    job_title: str
    company_name: str
    use_tailored: bool = False
    header: CoverLetterHeader = Field(default_factory=CoverLetterHeader)
    salutation: str = "Dear Hiring Manager,"
    body_paragraphs: List[str] = Field(default_factory=list)
    closing: str = "Sincerely,"
    candidate_name: str = ""
    full_text: str = ""
    created_at: datetime


class ExportCoverLetterPdfRequest(BaseModel):
    company_name: Optional[str] = ""
    job_title: Optional[str] = ""
    header: CoverLetterHeader = Field(default_factory=CoverLetterHeader)
    salutation: str = "Dear Hiring Manager,"
    body_paragraphs: List[str] = Field(default_factory=list)
    closing: str = "Sincerely,"
    candidate_name: str = ""
    full_text: Optional[str] = ""
