from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import generate_coach_response
from typing import Optional

router = APIRouter()

class CoachRequest(BaseModel):
    prompt: str
    system_prompt: str
    api_key: Optional[str] = None

@router.post("/generate", response_model=dict)
async def create_coach_response(request: CoachRequest):
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
        
    response_text = generate_coach_response(
        prompt=request.prompt, 
        system_prompt=request.system_prompt,
        api_key=request.api_key
    )
    
    return {"response": response_text}
