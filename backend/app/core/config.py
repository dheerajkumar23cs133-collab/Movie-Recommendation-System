from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "Movie Recommendation API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS settings
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:5173"  # Comma-separated origins
    
    # TMDB API settings
    TMDB_API_KEY: Optional[str] = "38159bed306f5edb71b1ba9ceccdf58f"  # Default fallback
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"
    TMDB_IMAGE_BASE_URL: str = "https://image.tmdb.org/t/p/w500"
    
    # Model settings - paths relative to project root or Render disk
    MODEL_PATH: str = os.environ.get("MODEL_PATH", "../model")
    MOVIES_MODEL_FILE: str = "movies.pkl"
    SIMILARITY_MODEL_FILE: str = "similarity.pkl"
    
    # Cache settings
    CACHE_DIR: str = os.environ.get("CACHE_DIR", "../cache")
    ENABLE_CACHE: bool = True
    
    # Rate limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds
    
    class Config:
        env_file = "../.env"
        case_sensitive = True


settings = Settings()