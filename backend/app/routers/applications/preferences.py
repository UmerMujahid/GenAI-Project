from fastapi import APIRouter #type:ignore
from app.schemas.application import UserPreferencesSchema#type:ignore
from app.agents.prompts import generate_discovery_prompt#type:ignore

router = APIRouter(prefix="/preferences", tags=["Preferences"])

@router.post("/submit")
async def submit_user_preferences(prefs: UserPreferencesSchema):
    formatted_prompt = generate_discovery_prompt(
        role=prefs.role,
        skills=", ".join(prefs.skills),
        city=prefs.city,
        work_type=prefs.work_type
    )
    return {
        "message": "Preferences received successfully",
        "agent_prompt": formatted_prompt
    }