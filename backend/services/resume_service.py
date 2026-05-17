import os
import json
import fitz  # PyMuPDF
import docx
from fastapi import UploadFile, HTTPException
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Configure Gemini
# You might want to pass the API key from the frontend or use a backend env var
# For this implementation, we expect the frontend to pass the api_key or we fall back to a default env var
def get_gemini_client(api_key: str = None):
    key = api_key or os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("Gemini API key is missing")
    genai.configure(api_key=key)
    
    # Dynamically find the best available model for the user's API key to avoid 404 errors
    available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
    if not available_models:
        raise ValueError("No generative models available for this API key.")
        
    # Prefer flash 1.5, then pro
    target_model = None
    for m in available_models:
        if '1.5-flash' in m:
            target_model = m
            break
            
    if not target_model:
        target_model = available_models[0]
        
    model_name = target_model.replace("models/", "")
    print(f"Dynamically selected model: {model_name}")
    return genai.GenerativeModel(model_name)

class ResumeAnalyzerService:
    @staticmethod
    async def extract_text_from_pdf(file: UploadFile) -> str:
        try:
            content = await file.read()
            doc = fitz.open(stream=content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text("text") + "\n"
            return text
        except Exception as e:
            raise Exception(f"Failed to parse PDF: {str(e)}")

    @staticmethod
    async def extract_text_from_docx(file: UploadFile) -> str:
        try:
            from io import BytesIO
            content = await file.read()
            doc = docx.Document(BytesIO(content))
            text = "\n".join([para.text for para in doc.paragraphs])
            return text
        except Exception as e:
            raise Exception(f"Failed to parse DOCX: {str(e)}")

    @staticmethod
    async def parse_resume(file: UploadFile, api_key: str = None) -> Dict[str, Any]:
        print(f"Parsing resume: {file.filename}")
        if file.filename.endswith(".pdf"):
            text = await ResumeAnalyzerService.extract_text_from_pdf(file)
        elif file.filename.endswith(".docx"):
            text = await ResumeAnalyzerService.extract_text_from_docx(file)
        elif file.filename.endswith(".txt"):
            content = await file.read()
            text = content.decode('utf-8')
        else:
            print("Unsupported format")
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")

        if not text.strip():
            print("No text extracted")
            raise HTTPException(status_code=400, detail="Could not extract text from the file.")

        model = get_gemini_client(api_key)
        
        prompt = f"""
You are an expert ATS (Applicant Tracking System) and AI Career Coach. 
Analyze the following resume text and extract a highly structured dynamic student profile.
CRITICAL INSTRUCTIONS:
1. BE EXTREMELY PRECISE. DO NOT hallucinate, guess, or invent any information that is not explicitly present in the text.
2. If a section (like projects, achievements, or cgpa) is missing, return an empty array [] or null. DO NOT make things up.
3. You must output ONLY valid JSON matching this exact structure. Do not output markdown code blocks, just raw JSON.

Structure requirements:
{{
  "academic": {{
    "degree": "string",
    "branch": "string",
    "cgpa": "string or float",
    "university": "string",
    "achievements": ["string"]
  }},
  "skills": [
    {{
      "name": "string",
      "category": "string (e.g. DSA, Web Dev, AI/ML, Cloud)",
      "strength": "integer 1-100",
      "relevance": "string"
    }}
  ],
  "projects": [
    {{
      "name": "string",
      "technologies": ["string"],
      "complexityLevel": "Beginner | Intermediate | Advanced",
      "innovationScore": "integer 1-10",
      "description": "string"
    }}
  ],
  "certifications": ["string"],
  "extracurriculars": ["string"],
  "insights": {{
    "careerInterests": ["string (e.g. Backend Engineer, Data Scientist)"],
    "strengths": ["string"],
    "weaknesses": ["string"],
    "missingIndustrySkills": ["string"],
    "placementReadinessScore": "integer 1-100",
    "recommendedCommunities": ["string (e.g. AI/ML, Web Dev, Cloud, Competitive Programming)"]
  }}
}}

Resume Text:
{text}
"""

        print(f"Extracted text successfully, calling Gemini...")
        
        # Configure strict, hallucination-free extraction
        generation_config = genai.types.GenerationConfig(
            temperature=0.0,
            top_p=0.1,
            top_k=1
        )
        
        try:
            # Try 1.5 Flash first
            try:
                response = await model.generate_content_async(prompt, generation_config=generation_config)
            except Exception as first_err:
                print(f"Failed with primary model: {str(first_err)}. Falling back to gemini-pro...")
                fallback_model = genai.GenerativeModel('gemini-pro')
                response = await fallback_model.generate_content_async(prompt, generation_config=generation_config)

            output = response.text.strip()
            print("Received response from Gemini")
            
            # Robust JSON extraction
            import re
            json_match = re.search(r'```(?:json)?(.*?)```', output, re.DOTALL)
            if json_match:
                output = json_match.group(1).strip()
            else:
                # If no code blocks, assume the whole string is JSON but strip leading/trailing spaces
                output = output.strip()
            
            parsed_data = json.loads(output)
            return parsed_data
        except Exception as e:
            error_msg = str(e)
            print("Gemini parsing error:", error_msg)
            raw_output = output if 'output' in locals() else 'No output'
            print("Raw Gemini output was:", raw_output)
            raise HTTPException(status_code=500, detail=f"AI Error: {error_msg} | Raw: {raw_output[:100]}")

