# Movie Recommendation System

A modern, full-stack movie recommendation web application built with FastAPI (backend) and React (frontend). The system uses content-based filtering with natural language processing to recommend similar movies based on user preferences.

## Features

- **Content-Based Recommendations**: Uses TF-IDF vectorization and cosine similarity to recommend movies
- **Modern UI**: Clean, responsive interface with dark mode support
- **Real-Time API Integration**: Fetches movie posters and details from TMDB API
- **Fast Performance**: Optimized API calls with timeout handling and parallel processing
- **Easy Deployment**: Ready for Render.com deployment with blueprint configuration

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.12**: Core programming language
- **scikit-learn**: Machine learning library for similarity calculations
- **pandas**: Data manipulation and analysis
- **TMDB API**: Movie metadata and poster images

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Project Structure

```
NLP-Movie-Recommendation-Webiste-ML-Project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── recommendations.py    # API endpoints
│   │   ├── core/
│   │   │   ├── config.py             # Configuration settings
│   │   │   └── security.py           # Security utilities
│   │   ├── models/
│   │   │   └── movie.py              # Data models
│   │   ├── services/
│   │   │   └── recommendation.py     # Recommendation logic
│   │   └── main.py                   # FastAPI application
│   ├── scripts/
│   │   └── setup_render.py           # Render deployment setup
│   ├── requirements.txt              # Python dependencies
│   └── tests/
│       └── test_api.py               # API tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MovieCard.tsx         # Movie card component
│   │   │   ├── MovieSelector.tsx     # Movie dropdown selector
│   │   │   ├── RecommendationResults.tsx  # Results display
│   │   │   └── LoadingSpinner.tsx    # Loading indicator
│   │   ├── hooks/
│   │   │   ├── useMovies.ts          # Movie data hook
│   │   │   └── useRecommendations.ts # Recommendations hook
│   │   ├── services/
│   │   │   └── api.ts                # API service
│   │   ├── App.tsx                   # Main application
│   │   └── main.tsx                  # Entry point
│   ├── package.json                 # Node dependencies
│   └── vite.config.ts               # Vite configuration
├── model/
│   ├── movies.pkl                    # Preprocessed movie data
│   └── similarity.pkl                # Similarity matrix
├── data/
│   ├── tmdb_5000_credits.csv         # Movie credits data
│   └── tmdb_5000_movies.csv          # Movie metadata
├── cache/                            # Cached poster images
├── docker/                           # Docker configuration
├── render.yaml                       # Render.com blueprint
└── DEPLOYMENT.md                     # Deployment guide

```

## Prerequisites

- Python 3.12 or higher
- Node.js 18 or higher
- TMDB API Key (free from https://www.themoviedb.org/)

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/dheerajkumar23cs133-collab/Movie-Recommendation-System.git
cd NLP-Movie-Recommendation-Webiste-ML-Project
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Set up environment variables:
```bash
# Create .env file in backend directory
TMDB_API_KEY=your_tmdb_api_key_here
MODEL_PATH=./model
CACHE_DIR=./cache
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Start the Application

**Option 1: Using start.bat (Windows)**
- Double-click `start.bat` in the project root
- This will start both backend and frontend servers

**Option 2: Manual Start**

Terminal 1 (Backend):
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## API Endpoints

### GET /health
Health check endpoint

### GET /api/movies
Get list of all available movies

### POST /api/recommendations
Get movie recommendations based on selected movie

**Request Body:**
```json
{
  "movie_title": "Avatar",
  "num_recommendations": 5
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "title": "Avatar",
      "poster_path": "/path/to/poster.jpg",
      "similarity": 1.0,
      "release_date": "2009-12-18",
      "vote_average": 7.8
    }
  ]
}
```

## Model Files

The application uses pre-trained model files:
- `model/movies.pkl`: Preprocessed movie data with combined features
- `model/similarity.pkl`: Cosine similarity matrix for recommendations

These files are tracked with Git LFS and will be downloaded automatically when cloning the repository.

## Deployment

### Render.com Deployment

The project includes a `render.yaml` blueprint for easy deployment to Render.com.

**Steps:**
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Blueprint"
3. Connect repository: `dheerajkumar23cs133-collab/Movie-Recommendation-System`
4. Render will detect `render.yaml` automatically
5. Click "Apply Blueprint"

**Environment Variables:**
- `TMDB_API_KEY`: Your TMDB API key
- `VITE_API_BASE_URL`: Backend URL (after deployment)

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will start both backend and frontend services in Docker containers.

## Performance Optimizations

- **API Timeouts**: Reduced from 60s to 15s (frontend) and 30s to 10s (backend)
- **Parallel Processing**: Limited to 3 workers to prevent API overload
- **Caching**: Poster images cached locally to reduce API calls
- **Lazy Loading**: Movie list loaded only when needed

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Missing model files:**
- Ensure `model/movies.pkl` and `model/similarity.pkl` exist
- They should be downloaded automatically via Git LFS

### Frontend Issues

**Module not found:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Check if backend is running on port 8000
- Verify `VITE_API_BASE_URL` in `.env` file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes.

## Acknowledgments

- TMDB API for movie data and posters
- The Movie Database (TMDB) for the dataset
- scikit-learn for machine learning utilities

## Contact

For questions or issues, please open an issue on GitHub.

## Repository

https://github.com/dheerajkumar23cs133-collab/Movie-Recommendation-System
