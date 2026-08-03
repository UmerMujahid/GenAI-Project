from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class InternshipResponse(BaseModel):
    id: str
    title: str
    company: str
    location: str
    skills_required: List[str]
    source_platform: str
    application_link: str
    deadline: Optional[str]
    description: Optional[str]
    scraped_at: datetime

    class Config:
        from_attributes = True
