import React from 'react';
import type { RecommendationResponse } from '../types/movie';
import MovieCard from './MovieCard';

interface RecommendationResultsProps {
  data: RecommendationResponse | null;
  loading?: boolean;
  isDarkMode?: boolean;
}

const RecommendationResults: React.FC<RecommendationResultsProps> = ({ data, loading, isDarkMode = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Finding recommendations...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>Select a movie and click "Get Recommendations" to see similar movies</p>
      </div>
    );
  }

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
  const gradientIndex = data.selected_movie.id % gradientColors.length;
  const gradientClass = gradientColors[gradientIndex];

  return (
    <div className="recommendation-results">
      {/* Selected Movie */}
      <div className="mb-8">
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Selected Movie</h3>
        <div className={`rounded-lg shadow-md p-6 max-w-md transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="relative w-24 h-36 rounded overflow-hidden">
                {data.selected_movie.poster_url ? (
                  <img
                    src={data.selected_movie.poster_url}
                    alt={data.selected_movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                
                {/* Fallback design */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center p-2 ${data.selected_movie.poster_url ? 'hidden' : ''}`}>
                  <div className="text-white/90 text-3xl mb-2">🎬</div>
                  <p className="text-white font-semibold text-center text-xs leading-tight line-clamp-2">
                    {data.selected_movie.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{data.selected_movie.title}</h4>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total movies in database: {data.total_movies}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Movies */}
      <div>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recommended Movies</h3>
        {data.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.recommendations.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : (
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No recommendations found</p>
        )}
      </div>
    </div>
  );
};

export default RecommendationResults;