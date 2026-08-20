from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.resume import Resume
from app.models.internship import Internship
from app.models.application import Application
from app.models.matched_job import MatchedJob
from app.models.tailored_resume import TailoredResume
from app.models.cover_letter import CoverLetter

async def init_db():
    """
    Initialize MongoDB connection using Motor and register Beanie document models.
    """
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    
    await init_beanie(
        database=db,
        document_models=[
            User,
            Resume,
            Internship,
            Application,
            MatchedJob,
            TailoredResume,
            CoverLetter,
        ]
    )
    print(f"Successfully connected to MongoDB database: '{settings.DB_NAME}'")
