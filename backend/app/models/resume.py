from datetime import datetime
from typing import List, Dict, Any, Optional
from beanie import Document, PydanticObjectId
from pydantic import Field

class Resume(Document):
    user_id: PydanticObjectId
    filename: str
    raw_text: str
    contact_info: Optional[Dict[str, Any]] = Field(default_factory=dict) # name, email, phone, linkedin, github, location
    skills: Optional[List[str]] = Field(default_factory=list)
    education: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    experience: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    projects: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    certifications: Optional[List[str]] = Field(default_factory=list)
    volunteer_work: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resumes"
