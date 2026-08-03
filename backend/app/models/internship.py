from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import Field

class Internship(Document):
    title: str
    company: str
    location: str
    skills_required: List[str] = []
    source_platform: str  # e.g. "LinkedIn", "Rozee.pk", "Mustakbil"
    application_link: str
    deadline: Optional[str] = None
    description: Optional[str] = None
    scraped_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "internships"
