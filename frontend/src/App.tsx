import { useState, useEffect } from 'react';
import { useMovies } from './hooks/useMovies';
import { useRecommendations } from './hooks/useRecommendations';
import MovieSelector from './components/MovieSelector';
import RecommendationResults from './components/RecommendationResults';
import LoadingSpinner from './components/LoadingSpinner';
import { movieApi } from './services/api';
import type { RecommendationRequest } from './types/movie';

function App() {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [numRecommendations, setNumRecommendations] = useState(5);
  const [showHealth, setShowHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch movies for the selector
  const { movies, loading: moviesLoading, error: moviesError } = useMovies(1, 100);

  // Recommendations hook
  const { recommendations, loading: recLoading, error: recError, getRecommendations } = useRecommendations();

  // Health check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await movieApi.healthCheck();
        setHealthStatus(health);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };
    checkHealth();
  }, []);

  const handleGetRecommendations = async () => {
    if (!selectedMovie) return;

    const request: RecommendationRequest = {
      movie_title: selectedMovie,
      num_recommendations: numRecommendations,
    };

    try {
      await getRecommendations(request);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Header */}
      <header className={`shadow-md transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🎬 Movie Recommendation</h1>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Discover similar movies using AI</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button
                onClick={() => setShowHealth(!showHealth)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
              >
                {showHealth ? 'Hide Status' : 'Show Status'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Health Status */}
      {showHealth && healthStatus && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>API Status</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Status:</span>
                <span className={`ml-2 ${healthStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                  {healthStatus.status}
                </span>
              </div>
              <div>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Version:</span>
                <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{healthStatus.version}</span>
              </div>
              <div>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Model:</span>
                <span className={`ml-2 ${healthStatus.is_model_loaded ? 'text-green-600' : 'text-red-600'}`}>
                  {healthStatus.is_model_loaded ? 'Loaded' : 'Not Loaded'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className={`rounded-xl shadow-lg p-6 mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Movie Selection */}
            <div>
              {moviesLoading ? (
                <LoadingSpinner message="Loading movies..." isDarkMode={isDarkMode} />
              ) : moviesError ? (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-50'}`}>
                  Error loading movies: {moviesError}
                </div>
              ) : (
                <MovieSelector
                  movies={movies}
                  selectedMovie={selectedMovie}
                  onMovieChange={setSelectedMovie}
                  disabled={recLoading}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>

            {/* Number of Recommendations */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Number of Recommendations
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={numRecommendations}
                onChange={(e) => setNumRecommendations(parseInt(e.target.value) || 5)}
                disabled={recLoading}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'}`}
              />
            </div>
          </div>

          {/* Get Recommendations Button */}
          <div className="mt-6">
            <button
              onClick={handleGetRecommendations}
              disabled={!selectedMovie || recLoading}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {recLoading ? 'Finding Recommendations...' : 'Get Recommendations'}
            </button>
          </div>

          {/* Error Message */}
          {recError && (
            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30 border border-red-800 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {recError}
            </div>
          )}
        </div>

        {/* Results */}
        <RecommendationResults data={recommendations} loading={recLoading} isDarkMode={isDarkMode} />
      </main>

      {/* Footer */}
      <footer className={`border-t mt-12 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className={`max-w-7xl mx-auto px-4 py-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>Movie Recommendation System powered by NLP and Machine Learning</p>
        </div>
      </footer>
    </div>
  );
}

export default App;