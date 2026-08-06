import pickle
import os
import time
import requests
from typing import List, Tuple, Optional
import numpy as np
import pandas as pd
from app.core.config import settings


class RecommendationService:
    """Service for handling movie recommendations."""
    
    def __init__(self):
        self.movies_df = None
        self.similarity_matrix = None
        self._load_models()
    
    def _load_models(self):
        """Load the pre-trained models from disk."""
        try:
            # Get the directory where this script is located
            current_dir = os.path.dirname(os.path.abspath(__file__))
            # Go up to project root
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
            
            model_path = os.path.join(project_root, "model")
            movies_path = os.path.join(model_path, settings.MOVIES_MODEL_FILE)
            similarity_path = os.path.join(model_path, settings.SIMILARITY_MODEL_FILE)
            
            with open(movies_path, 'rb') as f:
                self.movies_df = pickle.load(f)
            
            with open(similarity_path, 'rb') as f:
                self.similarity_matrix = pickle.load(f)
            
            print(f"Models loaded successfully. Total movies: {len(self.movies_df)}")
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            raise
    
    def get_all_movies(self) -> List[dict]:
        """Get all movies from the database."""
        if self.movies_df is None:
            return []
        
        return self.movies_df[["id", "title"]].to_dict('records')
    
    def get_movie_by_title(self, title: str) -> Optional[dict]:
        """Get a movie by its title."""
        if self.movies_df is None:
            return None
        
        movie = self.movies_df[self.movies_df["title"] == title]
        if movie.empty:
            return None
        
        return movie.iloc[0].to_dict()
    
    def get_recommendations(
        self, 
        movie_title: str, 
        num_recommendations: int = 5
    ) -> Tuple[Optional[dict], List[dict]]:
        """
        Get movie recommendations based on a given movie title.
        
        Args:
            movie_title: Title of the movie to get recommendations for
            num_recommendations: Number of recommendations to return
            
        Returns:
            Tuple of (selected_movie, recommendations_list)
        """
        if self.movies_df is None or self.similarity_matrix is None:
            return None, []
        
        # Check if movie exists
        if movie_title not in self.movies_df["title"].values:
            return None, []
        
        # Get movie index
        movie_index = self.movies_df[self.movies_df["title"] == movie_title].index[0]
        
        # Get similarity scores
        distances = self.similarity_matrix[movie_index]
        
        # Get top similar movies (excluding the movie itself)
        movie_list = sorted(
            list(enumerate(distances)), 
            reverse=True, 
            key=lambda x: x[1]
        )[1:num_recommendations + 1]
        
        # Get selected movie
        selected_movie = self.movies_df.iloc[movie_index].to_dict()
        
        # Get recommended movies with similarity scores
        recommendations = []
        for idx, similarity_score in movie_list:
            movie = self.movies_df.iloc[idx].to_dict()
            movie['similarity_score'] = float(similarity_score)
            recommendations.append(movie)
        
        return selected_movie, recommendations
    
    def search_movies(self, query: str, limit: int = 10) -> List[dict]:
        """Search for movies by title."""
        if self.movies_df is None:
            return []
        
        # Case-insensitive search
        mask = self.movies_df["title"].str.contains(query, case=False, na=False)
        results = self.movies_df[mask].head(limit)
        
        return results[["id", "title"]].to_dict('records')


class TMDBService:
    """Service for interacting with TMDB API."""
    
    def __init__(self):
        # Try to get API key from settings first, then from environment
        self.api_key = settings.TMDB_API_KEY or os.environ.get("TMDB_API_KEY")
        self.base_url = settings.TMDB_BASE_URL
        self.image_base_url = settings.TMDB_IMAGE_BASE_URL
        # In-memory cache for poster URLs
        self.poster_cache = {}
        print(f"TMDBService initialized with API key: {self.api_key[:10]}..." if self.api_key else "TMDBService initialized without API key")
    
    def fetch_poster_url(self, movie_id: int, max_retries: int = 3) -> Optional[str]:
        """
        Fetch poster URL from TMDB API with caching.
        
        Args:
            movie_id: TMDB movie ID
            max_retries: Maximum number of retry attempts
            
        Returns:
            Poster URL or None if not available
        """
        if not self.api_key:
            return None
        
        # Check cache first
        if movie_id in self.poster_cache:
            return self.poster_cache[movie_id]
        
        url = f"{self.base_url}/movie/{movie_id}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        params = {'api_key': self.api_key}
        
        for attempt in range(max_retries):
            try:
                response = requests.get(
                    url, 
                    headers=headers, 
                    params=params, 
                    timeout=10
                )
                
                if response.status_code == 200:
                    movie_data = response.json()
                    poster_path = movie_data.get('poster_path')
                    poster_url = None
                    if poster_path:
                        poster_url = f"{self.image_base_url}{poster_path}"
                    # Cache the result (even if None to avoid repeated failed calls)
                    self.poster_cache[movie_id] = poster_url
                    return poster_url
                elif response.status_code == 429:  # Rate limit
                    if attempt < max_retries - 1:
                        time.sleep(2 * (attempt + 1))
                        continue
                    return None
                else:
                    return None
                    
            except requests.exceptions.Timeout:
                if attempt < max_retries - 1:
                    time.sleep(2)
                    continue
                return None
            except requests.exceptions.ConnectionError:
                if attempt < max_retries - 1:
                    time.sleep(2)
                    continue
                return None
            except Exception as e:
                print(f"Error fetching poster: {str(e)}")
                return None
        
        return None
    
    def test_api_key(self) -> bool:
        """Test if the API key is valid."""
        if not self.api_key:
            print("TMDB API key not configured")
            return False
        
        try:
            url = f"{self.base_url}/movie/550"
            params = {'api_key': self.api_key}
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, params=params, headers=headers, timeout=10)
            print(f"TMDB API test response: {response.status_code}")
            print(f"Response content: {response.text[:200]}")
            return response.status_code == 200
        except Exception as e:
            print(f"TMDB API test error: {str(e)}")
            return False