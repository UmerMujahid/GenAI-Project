from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class ApplicationUpdateStatus(BaseModel):
    status: str

class ApplicationResponse(BaseModel):
    id: str
    user_id: str
    internship_id: str
    status: str
    match_score: Optional[float]
    tailored_resume_text: Optional[str]
    cover_letter_text: Optional[str]
    applied_at: datetime

    class Config:
        from_attributes = True
