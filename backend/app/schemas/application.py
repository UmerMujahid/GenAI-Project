from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class UserPreferencesSchema(BaseModel):
    role: str
    skills: List[str]
    city: str
    work_type: str

class ApplicationUpdateStatus(BaseModel):
    status: str

class ApplicationResponse(BaseModel):
    id: str
    user_id: str
    internship_id: str
    status: str
    match_score: Optional[float] = None
    tailored_resume_text: Optional[str] = None
    cover_letter_text: Optional[str] = None
    applied_at: datetime

    class Config:
        from_attributes = True
