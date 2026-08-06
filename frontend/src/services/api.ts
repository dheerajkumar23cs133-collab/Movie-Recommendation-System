import axios from 'axios';
import type {
  MovieBase,
  RecommendationRequest,
  RecommendationResponse,
  MovieListResponse,
  HealthResponse
} from '../types/movie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Request setup error
      console.error('Request Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export const movieApi = {
  // Health check
  async healthCheck(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/api/v1/health');
    return response.data;
  },

  // Get all movies with pagination
  async getMovies(page: number = 1, pageSize: number = 50, search?: string): Promise<MovieListResponse> {
    const params: Record<string, any> = { page, page_size: pageSize };
    if (search) params.search = search;
    
    const response = await apiClient.get<MovieListResponse>('/api/v1/movies', { params });
    return response.data;
  },

  // Get specific movie by ID
  async getMovie(movieId: number): Promise<MovieBase> {
    const response = await apiClient.get<MovieBase>(`/api/v1/movies/${movieId}`);
    return response.data;
  },

  // Get recommendations
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await apiClient.post<RecommendationResponse>('/api/v1/recommend', request);
    return response.data;
  },

  // Test TMDB API
  async testTMDB(): Promise<{ tmdb_api_configured: boolean; tmdb_api_working: boolean; message: string }> {
    const response = await apiClient.get('/api/v1/test-tmdb');
    return response.data;
  },
};

export default apiClient;