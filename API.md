# API Documentation

This document provides detailed information about the Movie Recommendation System API.

## Base URL

**Production**: https://movie-recommendation-backend-zlo0.onrender.com
**Local**: http://localhost:8000

## Authentication

Currently, the API does not require authentication. This may change in future versions.

## Rate Limiting

- **Requests**: 100 requests per minute
- **Period**: 60 seconds
- **Response**: HTTP 429 when limit exceeded

## Response Format

### Success Response

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "details": { ... }
}
```

## Endpoints

### Health Check

Check if the API is running and healthy.

**Endpoint**: `GET /api/v1/health`

**Response**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Status Codes**:
- `200 OK API is healthy`

---

### Get All Movies

Retrieve a paginated list of all available movies.

**Endpoint**: `GET /api/v1/movies`

**Query Parameters**:
- `page` (optional, default: 1) - Page number
- `page_size` (optional, default: 50) - Number of items per page
- `search` (optional) - Search query to filter movies by title

**Example Request**:
```bash
GET /api/v1/movies?page=1&page_size=50
GET /api/v1/movies?search=avatar
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "movies": [
      {
        "id": 1,
        "title": "Avatar"
      },
      {
        "id": 2,
        "title": "Pirates of the Caribbean: At World's End"
      }
    ],
    "total": 4800,
    "page": 1,
    "page_size": 50,
    "total_pages": 96
  }
}
```

**Status Codes**:
- `200 OK` - Movies retrieved successfully
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Server error

---

### Get Movie by ID

Retrieve details of a specific movie by its ID.

**Endpoint**: `GET /api/v1/movies/{movie_id}`

**Path Parameters**:
- `movie_id` (required) - The ID of the movie

**Example Request**:
```bash
GET /api/v1/movies/1
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Avatar",
    "genres": ["Action", "Adventure", "Fantasy"],
    "overview": "A paraplegic marine dispatched to the moon Pandora...",
    "release_date": "2009-12-18",
    "vote_average": 7.8,
    "vote_count": 15000
  }
}
```

**Status Codes**:
- `200 OK` - Movie retrieved successfully
- `404 Not Found` - Movie not found
- `500 Internal Server Error` - Server error

---

### Get Recommendations

Get movie recommendations based on a selected movie.

**Endpoint**: `POST /api/v1/recommend`

**Request Body**:
```json
{
  "movie_title": "Avatar",
  "num_recommendations": 5
}
```

**Request Parameters**:
- `movie_title` (required) - Title of the movie to base recommendations on
- `num_recommendations` (optional, default: 5) - Number of recommendations to return (max: 20)

**Example Request**:
```bash
POST /api/v1/recommend
Content-Type: application/json

{
  "movie_title": "Avatar",
  "num_recommendations": 5
}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "selected_movie": {
      "title": "Avatar",
      "poster_path": "/path/to/poster.jpg",
      "release_date": "2009-12-18",
      "vote_average": 7.8
    },
    "recommendations": [
      {
        "title": "Avatar",
        "poster_path": "/path/to/poster.jpg",
        "similarity": 1.0,
        "release_date": "2009-12-18",
        "vote_average": 7.8
      },
      {
        "title": "Pirates of the Caribbean: At World's End",
        "poster_path": "/path/to/poster.jpg",
        "similarity": 0.85,
        "release_date": "2007-05-24",
        "vote_average": 7.1
      }
    ]
  }
}
```

**Status Codes**:
- `200 OK` - Recommendations generated successfully
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Movie not found in database
- `500 Internal Server Error` - Server error

**Error Response Example**:
```json
{
  "status": "error",
  "message": "Movie not found",
  "details": {
    "movie_title": "Non-existent Movie"
  }
}
```

---

### Test TMDB API

Test the connectivity to TMDB API.

**Endpoint**: `GET /api/v1/test-tmdb`

**Response**:
```json
{
  "status": "success",
  "data": {
    "tmdb_api_configured": true,
    "tmdb_api_working": true,
    "message": "TMDB API is working correctly"
  }
}
```

**Status Codes**:
- `200 OK` - TMDB API test completed
- `500 Internal Server Error` - TMDB API not configured or not working

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Common Errors

### Movie Not Found

```json
{
  "status": "error",
  "message": "Movie not found in database",
  "details": {
    "movie_title": "Invalid Movie Title"
  }
}
```

**Solution**: Check the movie title spelling or use the `/api/v1/movies` endpoint to get valid movie titles.

### Rate Limit Exceeded

```json
{
  "status": "error",
  "message": "Rate limit exceeded",
  "details": {
    "limit": 100,
    "period": 60,
    "retry_after": 30
  }
}
```

**Solution**: Wait before making more requests or implement rate limiting in your client.

### TMDB API Error

```json
{
  "status": "error",
  "message": "TMDB API error",
  "details": {
    "error": "Invalid API key"
  }
}
```

**Solution**: Verify the TMDB API key is configured correctly in the backend.

## Data Models

### Movie Object

```typescript
{
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: string[];
}
```

### Recommendation Object

```typescript
{
  title: string;
  poster_path?: string;
  similarity: number;
  release_date?: string;
  vote_average?: number;
}
```

### Recommendation Request

```typescript
{
  movie_title: string;
  num_recommendations?: number;
}
```

### Recommendation Response

```typescript
{
  selected_movie: Movie;
  recommendations: Recommendation[];
}
```

## Interactive API Documentation

For interactive API documentation and testing, visit:

- **Production**: https://movie-recommendation-backend-zlo0.onrender.com/docs
- **Local**: http://localhost:8000/docs

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Schema documentation
- Try-it-out functionality

## Usage Examples

### cURL Examples

**Health Check**:
```bash
curl https://movie-recommendation-backend-zlo0.onrender.com/api/v1/health
```

**Get Movies**:
```bash
curl https://movie-recommendation-backend-zlo0.onrender.com/api/v1/movies
```

**Get Recommendations**:
```bash
curl -X POST https://movie-recommendation-backend-zlo0.onrender.com/api/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{"movie_title": "Avatar", "num_recommendations": 5}'
```

### JavaScript/TypeScript Examples

**Using Fetch**:
```typescript
const response = await fetch('https://movie-recommendation-backend-zlo0.onrender.com/api/v1/movies');
const data = await response.json();
console.log(data);
```

**Using Axios**:
```typescript
import axios from 'axios';

const getRecommendations = async (movieTitle: string) => {
  const response = await axios.post(
    'https://movie-recommendation-backend-zlo0.onrender.com/api/v1/recommend',
    {
      movie_title: movieTitle,
      num_recommendations: 5
    }
  );
  return response.data;
};
```

### Python Examples

**Using Requests**:
```python
import requests

response = requests.get('https://movie-recommendation-backend-zlo0.onrender.com/api/v1/movies')
data = response.json()
print(data)
```

**Get Recommendations**:
```python
import requests

response = requests.post(
    'https://movie-recommendation-backend-zlo0.onrender.com/api/v1/recommend',
    json={
        'movie_title': 'Avatar',
        'num_recommendations': 5
    }
)
data = response.json()
print(data)
```

## CORS Configuration

The API supports CORS for the following origins:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`
- `https://movie-recommendation-frontend-cjqs.onrender.com`

Additional origins can be configured in the backend settings.

## Best Practices

1. **Handle Errors**: Always check the response status and handle errors appropriately
2. **Rate Limiting**: Implement client-side rate limiting to avoid hitting the API rate limit
3. **Caching**: Cache movie lists and recommendations to reduce API calls
4. **Timeouts**: Set appropriate timeouts for API requests (recommended: 15s)
5. **Pagination**: Use pagination for large datasets to avoid timeouts

## Changelog

### Version 1.0.0
- Initial API release
- Health check endpoint
- Movies listing with pagination
- Movie recommendations
- TMDB API integration
