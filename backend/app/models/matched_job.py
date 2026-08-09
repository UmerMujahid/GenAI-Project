from datetime import datetime
from typing import List, Optional, Dict, Any
from beanie import Document, PydanticObjectId
from pydantic import Field, field_validator


class MatchedJob(Document):
    user_id: PydanticObjectId
    job_api_id: Optional[str] = None
    title: str
    organization: str
    organization_url: Optional[str] = ""
    apply_url: str = ""
    date_posted: Optional[str] = None
    employment_type: List[str] = Field(default_factory=list)

    # Salary Information
    salary_currency: Optional[str] = "USD"
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_unit: Optional[str] = "YEAR"

    # Work Arrangement & Requirements
    work_arrangement: Optional[str] = None       # e.g., "Remote OK", "Onsite", "Hybrid"
    experience_level: Optional[str] = None       # e.g., "Entry Level", "0-2 years"
    education: List[str] = Field(default_factory=list)             # e.g., ["bachelor degree"]
    visa_sponsorship: Optional[bool] = False

    # Detailed AI Extracted Summaries from Active Jobs DB
    key_skills: List[str] = Field(default_factory=list)
    core_responsibilities: Optional[str] = ""
    requirements_summary: Optional[str] = ""
    benefits: List[str] = Field(default_factory=list)

    # LLM Candidate Match Analysis
    match_score: float = 0.0                      # 0 to 100%
    matching_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    reasoning: str = ""

    source_platform: str = "Active Jobs DB"
    discovered_at: datetime = Field(default_factory=datetime.utcnow)

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

    class Settings:
        name = "matched_jobs"

