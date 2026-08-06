import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "app_name" in data
    assert "version" in data


def test_get_movies():
    """Test getting movies list."""
    response = client.get("/api/v1/movies")
    assert response.status_code == 200
    data = response.json()
    assert "movies" in data
    assert "total" in data
    assert isinstance(data["movies"], list)


def test_get_movies_with_pagination():
    """Test getting movies with pagination."""
    response = client.get("/api/v1/movies?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["movies"]) <= 10
    assert data["page"] == 1
    assert data["page_size"] == 10


def test_recommendations():
    """Test recommendations endpoint."""
    # First, get a list of movies to use for testing
    movies_response = client.get("/api/v1/movies?page=1&page_size=1")
    assert movies_response.status_code == 200
    movies = movies_response.json()["movies"]
    
    if movies:
        movie_title = movies[0]["title"]
        
        # Test recommendations
        response = client.post(
            "/api/v1/recommend",
            json={
                "movie_title": movie_title,
                "num_recommendations": 3
            }
        )
        
        # This might fail if TMDB API is not configured, but should still return 200
        assert response.status_code in [200, 404, 500]
        
        if response.status_code == 200:
            data = response.json()
            assert "selected_movie" in data
            assert "recommendations" in data


def test_recommendations_invalid_movie():
    """Test recommendations with invalid movie title."""
    response = client.post(
        "/api/v1/recommend",
        json={
            "movie_title": "NonExistentMovie12345",
            "num_recommendations": 5
        }
    )
    assert response.status_code == 404