from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import generate_roadmap_json
from typing import Optional

router = APIRouter()

class RoadmapRequest(BaseModel):
    goal: str
    level: str
    mode: str
    api_key: Optional[str] = None

@router.post("/generate", response_model=dict)
async def create_roadmap(request: RoadmapRequest):
    if not request.goal:
        raise HTTPException(status_code=400, detail="Goal cannot be empty")
        
    # generate_roadmap_json adds our domain logic and calls Gemini
    # Following the structural flow provided by the user
    roadmap_data = generate_roadmap_json(
        goal=request.goal, 
        level=request.level,
        mode=request.mode,
        api_key=request.api_key
    )
    
    # Send JSON response to frontend
    return roadmap_data
