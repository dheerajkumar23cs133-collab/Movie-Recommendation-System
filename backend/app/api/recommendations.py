from fastapi import APIRouter, HTTPException, Depends
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List
from app.models.movie import (
    MovieBase,
    MovieRecommendation,
    RecommendationRequest,
    RecommendationResponse,
    MovieListResponse,
    HealthResponse
)
from app.services.recommendation import RecommendationService, TMDBService
from app.core.config import settings


router = APIRouter(prefix="/api/v1", tags=["recommendations"])

# Initialize services
recommendation_service = RecommendationService()
tmdb_service = TMDBService()


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        is_model_loaded=recommendation_service.movies_df is not None
    ).model_dump()


@router.get("/movies")
async def get_movies(
    page: int = 1,
    page_size: int = 50,
    search: str = None
):
    """
    Get all movies with pagination and optional search.
    
    Args:
        page: Page number (1-indexed)
        page_size: Number of items per page
        search: Optional search query for movie titles
    """
    try:
        if search:
            movies = recommendation_service.search_movies(search, limit=page_size)
            total = len(movies)
        else:
            all_movies = recommendation_service.get_all_movies()
            start_idx = (page - 1) * page_size
            end_idx = start_idx + page_size
            movies = all_movies[start_idx:end_idx]
            total = len(all_movies)
        
        return MovieListResponse(
            movies=movies,
            total=total,
            page=page,
            page_size=page_size
        ).model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/movies/{movie_id}")
async def get_movie(movie_id: int):
    """Get a specific movie by ID."""
    try:
        all_movies = recommendation_service.get_all_movies()
        movie = next((m for m in all_movies if m["id"] == movie_id), None)
        
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        return MovieBase(**movie).model_dump()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    """
    Get movie recommendations based on a given movie.
    
    Args:
        request: Recommendation request with movie title and number of recommendations
    """
    try:
        selected_movie, recommendations = recommendation_service.get_recommendations(
            request.movie_title,
            request.num_recommendations
        )
        
        if not selected_movie:
            raise HTTPException(
                status_code=404, 
                detail=f"Movie '{request.movie_title}' not found in database"
            )
        
        # Fetch poster URLs for all movies in parallel
        selected_poster_url = tmdb_service.fetch_poster_url(selected_movie["id"])
        
        # Fetch recommendation poster URLs in parallel
        recommendation_list = []
        with ThreadPoolExecutor(max_workers=3) as executor:
            # Submit all poster fetch tasks
            future_to_movie = {
                executor.submit(tmdb_service.fetch_poster_url, rec["id"]): rec 
                for rec in recommendations
            }
            
            # Collect results as they complete
            for future in as_completed(future_to_movie):
                rec = future_to_movie[future]
                try:
                    poster_url = future.result()
                    recommendation_list.append(
                        MovieRecommendation(
                            id=rec["id"],
                            title=rec["title"],
                            poster_url=poster_url,
                            similarity_score=rec["similarity_score"]
                        )
                    )
                except Exception as e:
                    # If poster fetch fails, still include movie without poster
                    recommendation_list.append(
                        MovieRecommendation(
                            id=rec["id"],
                            title=rec["title"],
                            poster_url=None,
                            similarity_score=rec["similarity_score"]
                        )
                    )
        
        # Sort recommendations by similarity score to maintain order
        recommendation_list.sort(key=lambda x: x.similarity_score, reverse=True)
        
        # Build selected movie with poster
        selected_movie_with_poster = MovieBase(
            id=selected_movie["id"],
            title=selected_movie["title"],
            poster_url=selected_poster_url
        )
        
        return RecommendationResponse(
            selected_movie=selected_movie_with_poster.model_dump(),
            recommendations=[rec.model_dump() for rec in recommendation_list],
            total_movies=len(recommendation_service.get_all_movies())
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")


@router.get("/test-tmdb")
async def test_tmdb_api():
    """Test if TMDB API key is working."""
    # Reinitialize service to pick up new API key
    from app.services.recommendation import TMDBService
    global tmdb_service
    tmdb_service = TMDBService()
    
    is_working = tmdb_service.test_api_key()
    
    return {
        "tmdb_api_configured": tmdb_service.api_key is not None,
        "tmdb_api_working": is_working,
        "message": "API key is working" if is_working else "API key test failed"
    }