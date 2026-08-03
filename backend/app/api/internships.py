from typing import List, Optional
from fastapi import APIRouter
from app.models.internship import Internship
from app.schemas.internship import InternshipResponse

router = APIRouter(prefix="/internships", tags=["Internships"])

@router.get("/", response_model=List[InternshipResponse])
async def get_internships(platform: Optional[str] = None):
    if platform and platform.lower() != "all":
        internships = await Internship.find(Internship.source_platform == platform).to_list()
    else:
        internships = await Internship.find_all().to_list()

    return [
        InternshipResponse(
            id=str(item.id),
            title=item.title,
            company=item.company,
            location=item.location,
            skills_required=item.skills_required,
            source_platform=item.source_platform,
            application_link=item.application_link,
            deadline=item.deadline,
            description=item.description,
            scraped_at=item.scraped_at
        )
        for item in internships
    ]
