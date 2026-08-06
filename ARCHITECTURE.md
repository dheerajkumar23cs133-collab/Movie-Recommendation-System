# Architecture Documentation

This document describes the architecture of the Movie Recommendation System.

## Overview

The Movie Recommendation System is a full-stack web application consisting of:
- **Backend**: FastAPI REST API with ML-based recommendation engine
- **Frontend**: React SPA with TypeScript and TailwindCSS
- **ML Model**: Content-based filtering using TF-IDF and cosine similarity

## System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │         │   TMDB API      │
│   (React)       │◄────────►│   (FastAPI)     │◄────────►│   External      │
│                 │  HTTP    │                 │  HTTP    │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                    │
                                    │
                                    ▼
                            ┌─────────────────┐
                            │   ML Model     │
                            │   (Pickle)      │
                            └─────────────────┘
```

## Backend Architecture

### Technology Stack
- **Framework**: FastAPI
- **Language**: Python 3.12
- **ML Library**: scikit-learn
- **Data Processing**: pandas, numpy
- **API Documentation**: OpenAPI/Swagger (auto-generated)

### Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── recommendations.py    # API endpoints
│   ├── core/
│   │   ├── config.py             # Configuration settings
│   │   └── security.py           # Security utilities
│   ├── models/
│   │   └── movie.py              # Pydantic models
│   ├── services/
│   │   └── recommendation.py     # Business logic
│   └── main.py                   # Application entry point
├── scripts/
│   └── setup_render.py           # Deployment setup
├── tests/
│   └── test_api.py               # API tests
└── requirements.txt              # Dependencies
```

### Components

#### API Layer (`app/api/`)
- Handles HTTP requests/responses
- Request validation with Pydantic
- Error handling and status codes
- Rate limiting and CORS

#### Service Layer (`app/services/`)
- Business logic implementation
- ML model loading and inference
- TMDB API integration
- Data processing and transformation

#### Core Layer (`app/core/`)
- Configuration management
- Security utilities
- Database connections (if needed)
- Logging setup

#### Models (`app/models/`)
- Pydantic models for request/response
- Data validation schemas
- Type definitions

### Data Flow

1. **Request**: Client sends HTTP request to API
2. **Validation**: Pydantic validates request data
3. **Processing**: Service layer processes request
4. **ML Inference**: Model generates recommendations
5. **External API**: TMDB API fetches poster images
6. **Response**: API returns JSON response to client

### ML Pipeline

```
Raw Data → Preprocessing → Feature Extraction → TF-IDF → Cosine Similarity → Recommendations
```

#### Model Components
- **movies.pkl**: Preprocessed movie data with combined features
- **similarity.pkl**: Precomputed cosine similarity matrix

#### Recommendation Algorithm
1. User selects a movie
2. System finds movie in dataset
3. Retrieves similarity scores from matrix
4. Returns top N most similar movies
5. Fetches poster images from TMDB

## Frontend Architecture

### Technology Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── MovieCard.tsx         # Movie card display
│   │   ├── MovieSelector.tsx     # Movie dropdown
│   │   ├── RecommendationResults.tsx  # Results display
│   │   └── LoadingSpinner.tsx    # Loading indicator
│   ├── hooks/
│   │   ├── useMovies.ts          # Movie data hook
│   │   └── useRecommendations.ts # Recommendations hook
│   ├── services/
│   │   └── api.ts                # API service
│   ├── types/
│   │   └── movie.ts              # TypeScript types
│   ├── utils/
│   │   └── index.ts              # Utility functions
│   ├── App.tsx                   # Main application
│   └── main.tsx                  # Entry point
├── public/                       # Static assets
├── package.json                  # Dependencies
└── vite.config.ts                # Vite configuration
```

### Components

#### UI Components (`src/components/`)
- **MovieCard**: Displays movie poster and details
- **MovieSelector**: Dropdown for movie selection
- **RecommendationResults**: Displays recommendation results
- **LoadingSpinner**: Loading state indicator

#### Custom Hooks (`src/hooks/`)
- **useMovies**: Fetches and manages movie list
- **useRecommendations**: Fetches and manages recommendations

#### Services (`src/services/`)
- **api.ts**: Axios client with interceptors
- Request/response error handling
- Timeout configuration
- Base URL management

#### Types (`src/types/`)
- TypeScript interfaces for API responses
- Type definitions for components

### Data Flow

1. **User Action**: User selects movie
2. **Hook Trigger**: Custom hook makes API call
3. **API Request**: Axios sends HTTP request
4. **State Update**: React state updates with response
5. **Render**: Component re-renders with new data
6. **Display**: UI shows recommendations

### State Management

- **Local State**: useState for component-level state
- **Custom Hooks**: Reusable state logic
- **No Global State**: Simple app doesn't require Redux/Context

## API Design

### RESTful Endpoints

#### Health Check
- `GET /api/v1/health`
- Returns service health status

#### Movies
- `GET /api/v1/movies`
- Returns paginated list of movies
- Query params: `page`, `page_size`, `search`

#### Recommendations
- `POST /api/v1/recommend`
- Returns movie recommendations
- Body: `{ movie_title, num_recommendations }`

#### TMDB Test
- `GET /api/v1/test-tmdb`
- Tests TMDB API connectivity

### Response Format

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Handling

```json
{
  "status": "error",
  "message": "Error description",
  "details": { ... }
}
```

## Security Considerations

### Backend
- CORS configuration for allowed origins
- Rate limiting to prevent abuse
- Input validation with Pydantic
- Environment variables for sensitive data
- SQL injection prevention (if using database)

### Frontend
- Environment variables for API URLs
- HTTPS in production
- Input sanitization
- XSS prevention with React

## Performance Optimizations

### Backend
- **Caching**: Poster URLs cached in memory
- **Timeouts**: API calls have configurable timeouts
- **Lazy Loading**: Model files loaded at startup
- **Parallel Processing**: Limited workers for API calls

### Frontend
- **Code Splitting**: Vite automatic code splitting
- **Lazy Loading**: Components loaded on demand
- **Debouncing**: Search input debounced
- **Optimized Builds**: Minified and tree-shaken

## Scalability Considerations

### Current Limitations
- Single instance deployment
- No database (uses pickle files)
- No horizontal scaling
- Free tier constraints

### Future Improvements
- Add database (PostgreSQL/MongoDB)
- Implement caching layer (Redis)
- Add load balancing
- Container orchestration (Kubernetes)
- CDN for static assets
- Background job processing

## Deployment Architecture

### Render.com Deployment
- **Backend**: Python web service
- **Frontend**: Node web service
- **Storage**: Container filesystem (no persistent disk on free tier)
- **Environment Variables**: Configuration management
- **Auto-scaling**: Not available on free tier

### Local Development
- **Backend**: Uvicorn development server
- **Frontend**: Vite dev server
- **Hot Reload**: Both support hot reload
- **Proxy**: Vite proxies API calls to backend

## Monitoring and Logging

### Backend
- Console logging for debugging
- Error tracking in logs
- Performance metrics (if needed)
- Health check endpoint

### Frontend
- Console logging for debugging
- Error boundary for crash reporting
- Network request logging
- Performance monitoring (if needed)

## Testing Strategy

### Backend Testing
- Unit tests for services
- Integration tests for API endpoints
- Model validation tests
- Load testing for performance

### Frontend Testing
- Component tests with React Testing Library
- Integration tests for user flows
- E2E tests with Playwright (if needed)
- Accessibility tests

## Documentation

- **README.md**: Project overview and setup
- **DEPLOYMENT.md**: Deployment guide
- **CONTRIBUTING.md**: Contribution guidelines
- **ARCHITECTURE.md**: This document
- **API.md**: API documentation (auto-generated by FastAPI)

## Technology Rationale

### Backend Choices
- **FastAPI**: Modern, fast, automatic documentation
- **Python**: Rich ML ecosystem
- **scikit-learn**: Industry-standard ML library
- **Pydantic**: Data validation and serialization

### Frontend Choices
- **React**: Large ecosystem, component-based
- **TypeScript**: Type safety, better developer experience
- **Vite**: Fast build times, modern tooling
- **TailwindCSS**: Utility-first, rapid development

## Future Enhancements

### Features
- User authentication and profiles
- Personalized recommendations
- Movie ratings and reviews
- Watchlist functionality
- Advanced search and filters
- Movie trailers integration

### Technical
- Database migration
- Caching layer implementation
- Microservices architecture
- Real-time updates with WebSockets
- Mobile app development
- CI/CD pipeline improvement
