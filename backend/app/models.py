from datetime import datetime
from typing import List, Optional
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field

class User(Document):
    email: Indexed(str, unique=True)
    hashed_password: str
    full_name: str
    role_preference: Optional[str] = "Software Engineering Intern"
    city: Optional[str] = "Lahore"
    skills: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"  # MongoDB Collection Name

class Resume(Document):
    user_id: PydanticObjectId
    filename: str
    raw_text: str
    parsed_skills: List[str] = []
    parsed_experience: List[dict] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resumes"

class Internship(Document):
    title: str
    company: str
    location: str
    skills_required: List[str] = []
    source_platform: str  # e.g., "LinkedIn", "Rozee.pk", "Mustakbil"
    application_link: str
    deadline: Optional[str] = None
    description: Optional[str] = None
    scraped_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "internships"

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
