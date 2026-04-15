from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "وكل"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database — SQLite (auto-creates, no external DB needed)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./smartops.db"
    )

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "smartops-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Redis (optional - graceful degradation)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
