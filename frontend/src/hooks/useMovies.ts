import { useState, useEffect } from 'react';
import { movieApi } from '../services/api';
import type { MovieBase, MovieListResponse } from '../types/movie';

export const useMovies = (page: number = 1, pageSize: number = 50, search?: string) => {
  const [movies, setMovies] = useState<MovieBase[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: MovieListResponse = await movieApi.getMovies(page, pageSize, search);
        setMovies(response.movies);
        setTotal(response.total);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, pageSize, search]);

  return { movies, total, loading, error };
};