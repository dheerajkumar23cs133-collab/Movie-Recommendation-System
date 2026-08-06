import { useState } from 'react';
import { movieApi } from '../services/api';
import type { RecommendationRequest, RecommendationResponse } from '../types/movie';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (request: RecommendationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await movieApi.getRecommendations(request);
      setRecommendations(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.detail || err.message || 'Failed to get recommendations';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { recommendations, loading, error, getRecommendations };
};