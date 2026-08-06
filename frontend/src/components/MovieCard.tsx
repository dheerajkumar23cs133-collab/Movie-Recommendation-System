import React from 'react';
import type { MovieRecommendation } from '../types/movie';

interface MovieCardProps {
  movie: MovieRecommendation;
  onClick?: () => void;
  isDarkMode?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, isDarkMode = false }) => {
  // Gradient colors for fallback
  const gradientColors = [
    'from-blue-500 to-purple-600',
    'from-purple-500 to-pink-600',
    'from-pink-500 to-red-600',
    'from-red-500 to-orange-600',
    'from-orange-500 to-yellow-600',
    'from-green-500 to-teal-600',
    'from-teal-500 to-blue-600',
  ];
  
  // Use movie ID to pick a consistent gradient
  const gradientIndex = movie.id % gradientColors.length;
  const gradientClass = gradientColors[gradientIndex];
  
  return (
    <div
      className={`movie-card rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] bg-gray-200">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Fallback design */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center p-2 sm:p-4 ${movie.poster_url ? 'hidden' : ''}`}>
          <div className="text-white/90 text-3xl sm:text-5xl mb-2 sm:mb-3">🎬</div>
          <p className="text-white font-semibold text-center text-xs sm:text-sm leading-tight line-clamp-3">
            {movie.title}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3">
          <p className="text-white text-xs sm:text-sm font-semibold truncate">{movie.title}</p>
        </div>
      </div>
      <div className="p-2 sm:p-3">
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Similarity: {(movie.similarity_score * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;