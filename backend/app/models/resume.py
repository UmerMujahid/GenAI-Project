from datetime import datetime
from typing import List, Dict, Any
from beanie import Document, PydanticObjectId
from pydantic import Field

class Resume(Document):
    user_id: PydanticObjectId
    filename: str
    raw_text: str
    parsed_skills: List[str] = []
    parsed_experience: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resumes"
