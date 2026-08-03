from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role_preference: Optional[str] = "Software Engineering Intern"
    city: Optional[str] = "Lahore"
    skills: List[str] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role_preference: Optional[str]
    city: Optional[str]
    skills: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

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
