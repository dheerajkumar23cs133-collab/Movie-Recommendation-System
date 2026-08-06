# Render.com Deployment Guide

This guide will help you deploy the Movie Recommendation System to Render.com using the Blueprint feature.

## Current Deployment Status

The application is currently deployed and live on Render.com:

- **Frontend**: https://movie-recommendation-frontend-cjqs.onrender.com
- **Backend**: https://movie-recommendation-backend-zlo0.onrender.com
- **API Docs**: https://movie-recommendation-backend-zlo0.onrender.com/docs

## Prerequisites

1. A Render.com account (free tier available)
2. GitHub account with your repository
3. TMDB API key (get one from https://www.themoviedb.org/settings/api)
4. Git LFS installed (for large model files)

## Deployment Steps

### 1. Push Code to GitHub

Make sure your repository is pushed to GitHub with:
- `render.yaml` (blueprint configuration)
- `backend/` (FastAPI application)
- `frontend/` (React application)
- `model/` (Model files tracked with Git LFS)
- `.gitattributes` (Git LFS configuration)

### 2. Deploy to Render using Blueprint

1. Go to [Render.com](https://render.com) and log in
2. Click **"New +"** in the top right
3. Select **"Blueprint"**
4. Connect your GitHub repository: `dheerajkumar23cs133-collab/Movie-Recommendation-System`
5. Render will automatically detect the `render.yaml` file
6. Review the configuration and click **"Apply Blueprint"**

### 3. Configure Environment Variables

The `render.yaml` file includes all necessary environment variables:

**Backend Service:**
- `PORT`: 8000
- `PYTHON_VERSION`: 3.12.0
- `MODEL_PATH`: ./model
- `CACHE_DIR`: ./cache
- `TMDB_API_KEY`: XXXXXXX--------------XXXXXXXXX

**Frontend Service:**
- `NODE_VERSION`: 18
- `VITE_API_BASE_URL`: https://movie-recommendation-backend-zlo0.onrender.com

**Note:** After deployment, update `VITE_API_BASE_URL` with your actual backend URL if different.

## Blueprint Configuration

The `render.yaml` file configures two services:

### Backend Service
- **Name**: movie-recommendation-backend
- **Runtime**: Python 3.12
- **Plan**: Free
- **Build Command**: `cd backend && pip install -r requirements.txt`
- **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `MODEL_PATH`: ./model
  - `CACHE_DIR`: ./cache
  - `TMDB_API_KEY`: Configured for TMDB API access

### Frontend Service
- **Name**: movie-recommendation-frontend
- **Runtime**: Node 18
- **Plan**: Free
- **Build Command**: `cd frontend && npm install && npm run build`
- **Start Command**: `cd frontend && npm install -g serve && serve -s dist -l $PORT`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: Backend URL

## Important Notes

### Model Files
The ML model files (`movies.pkl` and `similarity.pkl`) are large (~186MB total):
- They are tracked with **Git LFS** in the repository
- No external hosting required
- Files are downloaded automatically during deployment
- Stored in the container's local filesystem (no persistent disk on free tier)

### Free Tier Limitations
Render free tier has some limitations:
- Services spin down after 15 minutes of inactivity
- Cold start may take 30-60 seconds
- No persistent disk storage (model files in container filesystem)
- Build time is limited

### Performance Tips
- The backend uses caching to improve response times
- TMDB API calls have timeouts to prevent long waits
- Poster URLs are cached in memory
- Model files are loaded once at startup

## Troubleshooting

### Backend fails to start
- Check the logs in Render dashboard
- Verify Git LFS files are properly tracked
- Ensure environment variables are set correctly
- Check that model files are present in the repository

### Model files not loading
- Verify Git LFS is properly configured
- Check that `.gitattributes` includes model files
- Ensure files are tracked with Git LFS: `git lfs track "model/*.pkl"`
- Verify files are pushed to GitHub with Git LFS

### Frontend can't connect to backend
- Ensure `VITE_API_BASE_URL` is set correctly
- Check that backend is running
- Verify CORS settings in backend config
- Check the actual backend URL in Render dashboard

### Build errors
- Check TypeScript compilation errors in logs
- Ensure all dependencies are in package.json
- Verify Node version is correct (18)
- Check that build output directory is `dist`

### Poster images not loading
- Verify TMDB API key is configured
- Check backend logs for TMDB API errors
- Ensure TMDB API key is valid and active
- Check network connectivity to TMDB API

## Post-Deployment

1. Access your frontend at: https://movie-recommendation-frontend-cjqs.onrender.com
2. Access your backend API docs at: https://movie-recommendation-backend-zlo0.onrender.com/docs
3. Test the application by selecting a movie and getting recommendations
4. Verify poster images are loading correctly
5. Check health status at backend `/api/v1/health` endpoint

## Updating the Application

To update after deployment:
1. Push changes to GitHub
2. Render will automatically detect changes and redeploy
3. Both services will rebuild with new code
4. Model files will be pulled from Git LFS
5. Or trigger a manual deploy from the Render dashboard

## Monitoring

- Monitor logs in Render dashboard
- Check service health status
- Monitor resource usage (CPU, memory)
- Verify model files are loaded successfully in logs
- Check API response times and error rates

## Security Considerations

- TMDB API key is currently in render.yaml (consider using Render secrets)
- Environment variables should be used for sensitive data
- Regularly update dependencies for security patches
- Monitor for any unauthorized access attempts
