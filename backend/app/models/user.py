from datetime import datetime
from typing import List, Optional
from beanie import Document, Indexed
from pydantic import Field

class User(Document):
    email: Indexed(str, unique=True)
    hashed_password: str
    full_name: str
    role_preference: Optional[str] = "Software Engineering Intern"
    city: Optional[str] = "Lahore"
    skills: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
