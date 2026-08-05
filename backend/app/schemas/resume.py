from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    summary: Optional[str] = ""
    parser_mode: Optional[str] = "LLM Agent"
    contact_info: Optional[Dict[str, Any]] = {}
    skills: Optional[List[str]] = []
    education: Optional[List[Dict[str, Any]]] = []
    experience: Optional[List[Dict[str, Any]]] = []
    projects: Optional[List[Dict[str, Any]]] = []
    certifications: Optional[List[str]] = []
    volunteer_work: Optional[List[Dict[str, Any]]] = []
    raw_text: Optional[str] = ""
    created_at: datetime

    class Config:
        from_attributes = True
