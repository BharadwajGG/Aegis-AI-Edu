from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from services.resume_service import ResumeAnalyzerService

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    apiKey: str = Form(None)
):
    """
    Endpoint to upload and analyze a resume using Gemini.
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
            
        profile_data = await ResumeAnalyzerService.parse_resume(file, apiKey)
        
        return {
            "status": "success",
            "message": "Resume analyzed successfully",
            "profile": profile_data
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
