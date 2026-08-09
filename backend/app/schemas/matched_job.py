from typing import List, Optional
from pydantic import BaseModel, field_validator
from datetime import datetime


class MatchedJobResponse(BaseModel):
    id: str
    user_id: str
    job_api_id: Optional[str] = None
    title: str
    organization: str
    organization_url: Optional[str] = ""
    apply_url: str = ""
    date_posted: Optional[str] = None
    employment_type: List[str] = []

    # Salary Information
    salary_currency: Optional[str] = "USD"
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_unit: Optional[str] = "YEAR"

    # Work Arrangement & Requirements
    work_arrangement: Optional[str] = None
    experience_level: Optional[str] = None
    education: List[str] = []
    visa_sponsorship: Optional[bool] = False

    # Detailed AI Extracted Summaries
    key_skills: List[str] = []
    core_responsibilities: Optional[str] = ""
    requirements_summary: Optional[str] = ""
    benefits: List[str] = []

    # LLM Match Analysis
    match_score: float = 0.0
    matching_skills: List[str] = []
    missing_skills: List[str] = []
    reasoning: str = ""

    source_platform: str = "Active Jobs DB"
    discovered_at: Optional[datetime] = None

    @field_validator(
        "employment_type",
        "education",
        "key_skills",
        "benefits",
        "matching_skills",
        "missing_skills",
        mode="before"
    )
    @classmethod
    def coerce_list(cls, v):
        if v is None:
            return []
        if isinstance(v, str):
            return [v]
        return v

