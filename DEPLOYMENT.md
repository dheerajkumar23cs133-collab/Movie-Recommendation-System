# Render.com Deployment Guide

This guide will help you deploy the Movie Recommendation System to Render.com using the Blueprint feature.

## Prerequisites

1. A Render.com account (free tier available)
2. GitHub account with your repository
3. TMDB API key (get one from https://www.themoviedb.org/settings/api)
4. External hosting for model files (Google Drive, Dropbox, AWS S3, etc.)

## Deployment Steps

### 1. Upload Model Files to External Storage

Since the model files are large (~186MB total), they need to be hosted externally:

**Option A: Google Drive**
1. Upload `model/movies.pkl` and `model/similarity.pkl` to Google Drive
2. Share the files and get direct download links
3. Convert to direct download links (replace `view?usp=sharing` with `uc?export=download&id=FILE_ID`)

**Option B: Dropbox**
1. Upload files to Dropbox
2. Create shared links
3. Convert to direct download links (replace `www.dropbox.com` with `dl.dropboxusercontent.com`)

**Option C: AWS S3**
1. Upload files to an S3 bucket
2. Make files public or use signed URLs
3. Get the direct URLs

**Option D: GitHub Releases**
1. Create a GitHub release
2. Upload model files as release assets
3. Use the asset download URLs

### 2. Push Code to GitHub

Make sure your repository is pushed to GitHub with:
- `render.yaml` (blueprint configuration)
- `backend/` (FastAPI application)
- `frontend/` (React application)
- **Note**: Model files are excluded from git (see `.gitignore`)

### 3. Deploy to Render using Blueprint

1. Go to [Render.com](https://render.com) and log in
2. Click **"New +"** in the top right
3. Select **"Blueprint"**
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file
6. Review the configuration and click **"Apply Blueprint"**

### 4. Configure Environment Variables

After deployment, you'll need to set the environment variables:

**Backend Service:**
1. Go to your backend service on Render
2. Navigate to **Environment** tab
3. Add the following environment variables:
   - `TMDB_API_KEY`: Your TMDB API key (e.g., `38159bed306f5edb71b1ba9ceccdf58f`)
   - `MOVIES_MODEL_URL`: Direct download URL for `movies.pkl`
   - `SIMILARITY_MODEL_URL`: Direct download URL for `similarity.pkl`
4. Click **"Save Changes"**
5. Trigger a manual deploy to apply the changes

### 5. Update Frontend API URL

After the backend is deployed:

1. Copy your backend URL from Render (e.g., `https://movie-recommendation-backend.onrender.com`)
2. Go to your frontend service on Render
3. Navigate to **Environment** tab
4. Update the `VITE_API_BASE_URL` variable:
   - Value: Your backend URL
5. Click **"Save Changes"**
6. Trigger a manual deploy to apply the changes

## Blueprint Configuration

The `render.yaml` file configures two services:

### Backend Service
- **Name**: movie-recommendation-backend
- **Runtime**: Python 3.12
- **Disk**: 1GB persistent storage for model files
- **Setup Script**: Downloads model files from external URLs to persistent disk
- **Environment Variables**:
  - `MODEL_PATH`: `/opt/render/project/data/model`
  - `CACHE_DIR`: `/opt/render/project/data/cache`
  - `TMDB_API_KEY`: Your TMDB API key
  - `MOVIES_MODEL_URL`: Direct download URL for movies.pkl
  - `SIMILARITY_MODEL_URL`: Direct download URL for similarity.pkl

### Frontend Service
- **Name**: movie-recommendation-frontend
- **Runtime**: Node 18
- **Build**: `npm install && npm run build`
- **Serve**: Using `serve` to serve static files
- **Environment Variables**:
  - `VITE_API_BASE_URL`: Backend URL (update after backend deployment)

## Important Notes

### Model Files
The ML model files (`movies.pkl` and `similarity.pkl`) are large (~186MB total):
- They are **NOT** included in the git repository
- They must be hosted externally (Google Drive, Dropbox, S3, etc.)
- The setup script downloads them to persistent disk on first deployment
- This ensures they persist across deployments
- External URLs must be provided via environment variables

### Free Tier Limitations
Render free tier has some limitations:
- Services spin down after 15 minutes of inactivity
- Cold start may take 30-60 seconds
- Disk storage is limited to 1GB
- Build time is limited

### Performance Tips
- The backend uses caching to improve response times
- TMDB API calls have timeouts to prevent long waits
- Poster URLs are cached in memory
- Model files are downloaded once and cached on disk

## Troubleshooting

### Backend fails to start
- Check the logs in Render dashboard
- Ensure model file URLs are correct and accessible
- Verify environment variables are set correctly
- Check that the external URLs allow direct downloads

### Model files not downloading
- Verify the download URLs are accessible
- Check that URLs are direct download links (not web pages)
- Ensure URLs don't require authentication
- Check the setup script logs in Render

### Frontend can't connect to backend
- Ensure `VITE_API_BASE_URL` is set correctly
- Check that backend is running
- Verify CORS settings in backend config

### Download timeout
- Large files may take time to download
- Check Render logs for download progress
- Ensure external hosting has sufficient bandwidth

## Post-Deployment

1. Access your frontend at: `https://movie-recommendation-frontend.onrender.com`
2. Access your backend API docs at: `https://movie-recommendation-backend.onrender.com/docs`
3. Test the application by selecting a movie and getting recommendations

## Updating the Application

To update after deployment:
1. Push changes to GitHub
2. Render will automatically detect changes and redeploy
3. Model files won't be re-downloaded if they already exist on disk
4. Or trigger a manual deploy from the Render dashboard

## Monitoring

- Monitor logs in Render dashboard
- Check service health status
- Monitor resource usage (CPU, memory, disk)
- Verify model files are downloaded successfully in logs
