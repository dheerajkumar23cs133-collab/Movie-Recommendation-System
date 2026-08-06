from pydantic import BaseModel, Field
from typing import List, Optional


class MovieBase(BaseModel):
    """Base movie model with common fields."""
    id: int
    title: str
    poster_url: Optional[str] = None


class Movie(MovieBase):
    """Complete movie model with all fields."""
    tags: Optional[str] = None
    poster_path: Optional[str] = None


class MovieRecommendation(BaseModel):
    """Movie recommendation with poster URL."""
    id: int
    title: str
    poster_url: Optional[str] = None
    similarity_score: float = Field(..., ge=0.0, le=1.0)


class RecommendationRequest(BaseModel):
    """Request model for movie recommendations."""
    movie_title: str = Field(..., min_length=1, description="Title of the movie to get recommendations for")
    num_recommendations: int = Field(default=5, ge=1, le=10, description="Number of recommendations to return")


class RecommendationResponse(BaseModel):
    """Response model for movie recommendations."""
    selected_movie: MovieBase
    recommendations: List[MovieRecommendation]
    total_movies: int


class MovieListResponse(BaseModel):
    """Response model for movie list."""
    movies: List[MovieBase]
    total: int
    page: int
    page_size: int


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    app_name: str
    version: str
    is_model_loaded: bool
    
    class Config:
        protected_namespaces = ()