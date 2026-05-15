from fastapi import APIRouter, HTTPException, Body, Header
from typing import List, Dict, Optional
from services.drives_service import drives_service
from services.ai_service import generate_study_guide

router = APIRouter()

@router.get("/")
def get_drives(months: int = 3):
    """Fetch all upcoming drives for the next N months."""
    return drives_service.get_upcoming_drives(months)

@router.post("/recommendations")
def get_recommendations(student_profile: Dict = Body(...)):
    """Fetch personalized drive recommendations based on student profile."""
    return drives_service.get_recommendations(student_profile)

@router.get("/{drive_id}/roadmap")
def get_drive_roadmap(drive_id: str):
    """Generate an AI-powered preparation roadmap for a specific drive."""
    roadmap = drives_service.get_preparation_roadmap(drive_id)
    if "error" in roadmap:
        raise HTTPException(status_code=404, detail=roadmap["error"])
    return roadmap

@router.post("/{drive_id}/eligibility")
def check_eligibility(drive_id: str, student_profile: Dict = Body(...)):
    """Automatically determine if a student is eligible for a drive."""
    result = drives_service.check_eligibility(drive_id, student_profile)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.post("/{drive_id}/guide")
def get_personalized_guide(drive_id: str, student_profile: Dict = Body(...), x_api_key: Optional[str] = Header(None)):
    """Generate a highly personalized AI study guide for a specific drive."""
    drive = next((d for d in drives_service.drives if d["id"] == drive_id), None)
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
    
    return generate_study_guide(drive, student_profile, api_key=x_api_key)

@router.post("/{drive_id}/insight")
def get_label_mate_insight(drive_id: str, student_profile: Dict = Body(...)):
    """Fetch AI-powered hiring readiness insights."""
    result = drives_service.get_label_mate_insight(drive_id, student_profile)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.post("/{drive_id}/apply")
def apply_drive(drive_id: str):
    """Apply for a drive."""
    # Logic for applying (can be mocked for now)
    return {"status": "success", "message": f"Applied for drive {drive_id} successfully."}

@router.post("/{drive_id}/save")
def save_drive(drive_id: str):
    """Save a drive for later."""
    return {"status": "success", "message": f"Drive {drive_id} saved successfully."}
