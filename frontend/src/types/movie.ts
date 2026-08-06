export interface Movie {
  id: number;
  title: string;
  tags?: string;
  poster_path?: string;
}

export interface MovieBase {
  id: number;
  title: string;
  poster_url?: string;
}

export interface MovieRecommendation {
  id: number;
  title: string;
  poster_url?: string;
  similarity_score: number;
}

export interface RecommendationRequest {
  movie_title: string;
  num_recommendations?: number;
}

export interface RecommendationResponse {
  selected_movie: MovieBase;
  recommendations: MovieRecommendation[];
  total_movies: number;
}

export interface MovieListResponse {
  movies: MovieBase[];
  total: number;
  page: number;
  page_size: number;
}

export interface HealthResponse {
  status: string;
  app_name: string;
  version: string;
  is_model_loaded: boolean;
}