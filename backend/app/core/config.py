import os
from pathlib import Path
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(ENV_PATH, override=True)

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, AliasChoices

class Settings(BaseSettings):
    # MongoDB
    MONGO_URI: str = Field(
        default="mongodb://localhost:27017",
        validation_alias=AliasChoices("MONGO_URI", "MONGODB_URI")
    )
    DB_NAME: str = "internship_navigator"

    # JWT Authentication
    JWT_SECRET: str = "super_secret_key_change_in_production"
    JWT_EXPIRE_MINUTES: int = 60

    # LLM Settings
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    HF_API_TOKEN: str = ""
    RAPIDAPI_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    # Application
    APP_ENV: str = "development"
    APP_PORT: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
