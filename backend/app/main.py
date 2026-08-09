import sys
from pathlib import Path

# Ensure project root is in sys.path so top-level packages like 'ai' can be imported
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.internships import router as internships_router
from app.api.resume import router as resume_router
from app.api.jobs import router as jobs_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title="AI Internship Navigator API",
    description="Backend API service powered by Umer, FastAPI, MongoDB (Motor/Beanie), and LangChain",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix="/api")
app.include_router(internships_router, prefix="/api")
app.include_router(resume_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Internship Navigator Backend"}

@app.get("/api/health")
async def health_check():
    return {"status": "online", "database": settings.DB_NAME}
