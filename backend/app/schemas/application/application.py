from pydantic import BaseModel #type:ignore
from typing import List

class UserPreferencesSchema(BaseModel):
    role: str
    skills: List[str]
    city: str
    work_type: str