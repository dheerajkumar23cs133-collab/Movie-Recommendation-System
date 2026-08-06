import React from 'react';
import type { MovieBase } from '../types/movie';

interface MovieSelectorProps {
  movies: MovieBase[];
  selectedMovie: string;
  onMovieChange: (movieTitle: string) => void;
  loading?: boolean;
  disabled?: boolean;
  isDarkMode?: boolean;
}

const MovieSelector: React.FC<MovieSelectorProps> = ({
  movies,
  selectedMovie,
  onMovieChange,
  loading = false,
  disabled = false,
  isDarkMode = false,
}) => {
  return (
    <div className="movie-selector">
      <label htmlFor="movie-select" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Select a Movie
      </label>
      <select
        id="movie-select"
        value={selectedMovie}
        onChange={(e) => onMovieChange(e.target.value)}
        disabled={disabled || loading}
        className={`w-full p-3 sm:p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed transition-colors duration-300 text-base sm:text-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'}`}
      >
        <option value="">-- Choose a movie --</option>
        {movies.map((movie) => (
          <option key={movie.id} value={movie.title}>
            {movie.title}
          </option>
        ))}
      </select>
      {loading && (
        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading movies...</p>
      )}
    </div>
  );
};

export default MovieSelector;