from datetime import datetime
from typing import Optional
from beanie import Document, PydanticObjectId
from pydantic import Field

class Application(Document):
    user_id: PydanticObjectId
    internship_id: PydanticObjectId
    status: str = "Pending"  # "Applied", "Pending", "Interview Scheduled", "Rejected", "Accepted"
    match_score: Optional[float] = 0.0
    tailored_resume_text: Optional[str] = None
    cover_letter_text: Optional[str] = None
    applied_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "applications"
