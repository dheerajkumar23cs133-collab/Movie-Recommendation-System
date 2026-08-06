from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.recommendations import router as recommendations_router


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Movie Recommendation API using NLP and ML",
        docs_url="/api/docs",
        redoc_url="/api/redoc"
    )
    
    # Configure CORS
    cors_origins = settings.CORS_ORIGINS.split(",") if isinstance(settings.CORS_ORIGINS, str) else settings.CORS_ORIGINS
    print(f"CORS origins configured: {cors_origins}")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for development
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(recommendations_router)
    
    # Root endpoint
    @app.get("/")
    async def root():
        return {
            "message": "Movie Recommendation API",
            "version": settings.APP_VERSION,
            "docs": "/api/docs"
        }
    
    return app


app = create_application()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )