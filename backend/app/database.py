from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models import User, Resume, Internship, Application

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
            Application
        ]
    )
    print(f"Successfully connected to MongoDB database: '{settings.DB_NAME}'")
