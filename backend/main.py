from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.roadmap import router as roadmap_router
from routes.coach import router as coach_router
from routes.drives import router as drives_router
from config import settings

app = FastAPI(title="AI Roadmap API")

# Configure CORS so the Vite frontend can seamlessly call the backend without blocked requests.
app.add_middleware(
    CORSMiddleware,
    # allows all domains for dev flexibly, or restrict to frontend specifically
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:5174", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5175", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Application startup and route registers
app.include_router(roadmap_router, prefix="/api/roadmap", tags=["Roadmap Flow"])
app.include_router(coach_router, prefix="/api/coach", tags=["Concept Coach Flow"])
app.include_router(drives_router, prefix="/api/drives", tags=["Placement Drives Flow"])


@app.get("/health")
def health_check():
    """Simple health check endpoint to make sure backend is up."""
    return {"status": "ok", "service": "Aegis AI Roadmap Generator"}

# --- IN-MEMORY STORAGE FOR COLLEGE DASHBOARD ---
# In a real app, this would be in a database (Firebase/Postgres)
MOCK_CLUBS = []
MOCK_EVENTS = []
MOCK_FEED = []

# Mock data for initial rendering
MOCK_STUDENTS = [
    {"id": "S001", "name": "Aryan Desai", "dept": "Computer Science", "skillScore": 92, "masteryLevel": "Advanced", "streak": 14, "integrityBadge": True},
    {"id": "S002", "name": "Priya Sharma", "dept": "Information Tech", "skillScore": 85, "masteryLevel": "Intermediate", "streak": 5, "integrityBadge": True},
    {"id": "S003", "name": "Rahul Verma", "dept": "Computer Science", "skillScore": 64, "masteryLevel": "Beginner", "streak": 1, "integrityBadge": False}, # Below threshold
    {"id": "S004", "name": "Neha Gupta", "dept": "Electronics", "skillScore": 78, "masteryLevel": "Intermediate", "streak": 8, "integrityBadge": True},
]

MOCK_ACHIEVEMENTS = [
    {"department": "Computer Science", "score": 880},
    {"department": "Information Tech", "score": 750},
    {"department": "Electronics", "score": 620},
    {"department": "Mechanical", "score": 410},
]

# --- COLLEGE DASHBOARD ENDPOINTS ---

from pydantic import BaseModel
from typing import Optional

class Club(BaseModel):
    name: str
    tags: str
    description: str
    memberCount: int

class Event(BaseModel):
    name: str
    date: str
    type: str
    description: str
    targetAudience: str

class FeedPost(BaseModel):
    company: str
    date: str
    role: str
    ctc: str

@app.post("/api/college/clubs")
def register_club(club: Club):
    MOCK_CLUBS.append(club.dict())
    return {"status": "success", "message": "Club registered successfully", "club": club}

@app.get("/api/college/clubs")
def get_clubs():
    return {"clubs": MOCK_CLUBS}

@app.post("/api/college/events")
def post_event(event: Event):
    MOCK_EVENTS.append(event.dict())
    return {"status": "success", "message": "Event posted successfully", "event": event}

@app.get("/api/college/events")
def get_events():
    return {"events": MOCK_EVENTS}

@app.get("/api/college/students")
def get_students():
    return {"students": MOCK_STUDENTS}

@app.get("/api/college/achievements")
def get_achievements():
    return {"achievements": MOCK_ACHIEVEMENTS}

@app.get("/api/college/stats")
def get_naac_stats():
    return {
        "totalStudents": 5240,
        "avgIntegrityScore": 88,
        "clubsRegistered": len(MOCK_CLUBS),
        "eventsHeld": len(MOCK_EVENTS)
    }

@app.post("/api/college/recruiter-feed")
def post_recruiter_feed(post: FeedPost):
    MOCK_FEED.append(post.dict())
    return {"status": "success", "message": "Feed posted successfully"}

@app.get("/api/college/recruiter-feed")
def get_recruiter_feed():
    return {"feed": MOCK_FEED}
