from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.roadmap import router as roadmap_router
from config import settings

app = FastAPI(title="AI Roadmap API")

# Configure CORS so the Vite frontend can seamlessly call the backend without blocked requests.
app.add_middleware(
    CORSMiddleware,
    # allows all domains for dev flexibly, or restrict to frontend specifically
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:5174", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Application startup and route registers
app.include_router(roadmap_router, prefix="/api/roadmap", tags=["Roadmap Flow"])

@app.get("/health")
def health_check():
    """Simple health check endpoint to make sure backend is up."""
    return {"status": "ok", "service": "Aegis AI Roadmap Generator"}
