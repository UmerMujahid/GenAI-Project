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
    HF_API_TOKEN: str = ""
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
