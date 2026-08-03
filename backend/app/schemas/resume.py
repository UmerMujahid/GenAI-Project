from datetime import datetime
from typing import List, Dict, Any
from pydantic import BaseModel

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    parsed_skills: List[str]
    parsed_experience: List[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True
