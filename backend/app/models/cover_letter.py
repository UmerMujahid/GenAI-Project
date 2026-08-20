from datetime import datetime
from typing import Any, Dict, List, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field


class CoverLetter(Document):
    user_id: PydanticObjectId
    resume_id: PydanticObjectId
    job_id: PydanticObjectId
    tailored_resume_id: Optional[PydanticObjectId] = None
    job_title: str = ""
    company_name: str = ""
    use_tailored: bool = False

    header: Dict[str, Any] = Field(default_factory=dict)
    salutation: str = "Dear Hiring Manager,"
    body_paragraphs: List[str] = Field(default_factory=list)
    closing: str = "Sincerely,"
    candidate_name: str = ""

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "cover_letters"
