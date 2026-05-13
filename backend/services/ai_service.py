import json
import google.generativeai as genai
from config import settings

# Initialize Gemini is deferred to generate_roadmap_json to allow dynamic keys

# Model instantiation deferred to request time

def build_domain_context(goal: str, level: str) -> str:
    """
    Adds domain-specific intelligence or guardrails 
    before sending to the LLM. 
    This is the backend logic that enriches the user's raw prompt.
    """
    base_instructions = (
        "You are an expert AI curriculum designer. "
        "Create a highly structured, step-by-step learning roadmap for the user. "
    )
    
    # Example logic to add domain structure based on goal keywords
    goal_lower = goal.lower()
    if "react" in goal_lower or "frontend" in goal_lower:
        base_instructions += "Ensure you include modern React practices like Hooks, Server Components, and Context API. "
    elif "python" in goal_lower or "backend" in goal_lower:
        base_instructions += "Focus on robust API architecture, databases, and modern Python features. "
        
    base_instructions += f"\nThe user's level is '{level}'. Adjust the complexity of the roadmap topics so it accurately reflects their skill level. "
    
    return base_instructions

def generate_roadmap_json(goal: str, level: str, mode: str, api_key: str = None) -> dict:
    if api_key:
        genai.configure(api_key=api_key)
    else:
        genai.configure(api_key=settings.GEMINI_API_KEY)

    # Use the recommended model for fast and structured text generation
    model = genai.GenerativeModel('gemini-2.5-flash')

    domain_context = build_domain_context(goal, level)
    
    prompt = f"""
{domain_context}

User Profile:
- Goal: {goal}
- Level: {level}
- Mode: {mode} (adjust the intensity and pacing of the schedule based on this specified learning mode)

You MUST respond strictly with a valid JSON object matching the exact structure below. 
Do NOT wrap the JSON in Markdown code blocks (e.g., no ```json).
Do NOT include any extra text outside the JSON.

{{
  "roadmap": {{
    "title": "A descriptive title for the roadmap",
    "summary": "A short 2-sentence summary of what this roadmap achieves",
    "phases": [
      {{
        "phaseNumber": 1,
        "title": "Phase Title",
        "topics": ["Core Topic 1", "Core Topic 2", "Core Topic 3"],
        "duration": "Estimated time (e.g., 2 weeks)",
        "resources": ["A recommended resource or search query to look up"]
      }}
    ]
  }}
}}
"""
    
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error calling Gemini:\n{error_details}")
        # Send a fallback structured JSON on failure
        return {
            "roadmap": {
                "title": f"Failed to generate roadmap for {goal}",
                "summary": f"Error: {e}",
                "phases": []
            }
        }

def generate_coach_response(prompt: str, system_prompt: str, api_key: str = None) -> str:
    if api_key:
        genai.configure(api_key=api_key)
    else:
        genai.configure(api_key=settings.GEMINI_API_KEY)

    structured_prompt = f"""
    You are an AI Concept Coach and expert tutor. 
    The student needs help with: "{prompt}"
    
    You MUST output STRICTLY valid JSON matching exactly this syntax format:
    {{
      "hint1": "Provide a broad, conceptual stepping stone that helps them think about how to start.",
      "hint2": "Provide a more specific hint, nudging them towards the correct mathematical or logical approach.",
      "hint3": "Provide an explicit almost-giveaway hint that makes the solution obvious.",
      "answer": "Provide the concise, highly optimized, and mathematically direct final answer."
    }}
    
    Do NOT use Markdown formatting (No ```json). Start your output with {{ and end with }}.
    """

    model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="You are a JSON-only API responding strictly according to schema.")

    try:
        response = model.generate_content(
            structured_prompt,
            generation_config={
                "temperature": 0.7,
                "response_mime_type": "application/json"
            }
        )
        return response.text
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error calling Gemini for Coach:\n{error_details}")
        return "Failed to connect to AI. Please check the API configuration on the backend."

def generate_study_guide(drive_info: dict, student_profile: dict, api_key: str = None) -> dict:
    if api_key:
        genai.configure(api_key=api_key)
    else:
        genai.configure(api_key=settings.GEMINI_API_KEY)

    model = genai.GenerativeModel('gemini-2.5-flash')

    prompt = f"""
    You are an expert AI Career Coach. 
    Generate a personalized study guide for a student preparing for a placement drive.

    Company: {drive_info.get('company_name')}
    Role: {drive_info.get('role_offered')}
    Required Skills: {', '.join(drive_info.get('required_skills', []))}
    Hiring Process: {', '.join(drive_info.get('hiring_process', []))}

    Student Profile:
    - Skills: {', '.join(student_profile.get('skills', []))}
    - GPA: {student_profile.get('gpa')}
    - Interests: {', '.join(student_profile.get('interests', []))}

    You MUST respond strictly with a valid JSON object matching the exact structure below. 
    Do NOT wrap the JSON in Markdown code blocks.
    Do NOT include any extra text.

    {{
      "title": "Personalized Study Guide for [Company]",
      "focus_areas": [
        {{
          "topic": "Topic Name",
          "reason": "Why this is important for this student/company",
          "resources": ["Resource 1", "Resource 2"]
        }}
      ],
      "daily_plan": [
        {{ "day": 1, "activity": "Specific activity description" }}
      ],
      "interview_questions": ["Question 1", "Question 2"],
      "final_tip": "A motivational closing tip"
    }}
    """

    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error generating study guide: {e}")
        return {
            "title": f"Prep Guide for {drive_info.get('company_name')}",
            "focus_areas": [{"topic": "General DSA", "reason": "Always important", "resources": ["LeetCode"]}],
            "daily_plan": [{"day": 1, "activity": "Revise basics"}],
            "interview_questions": ["Tell me about yourself"],
            "final_tip": "Keep practicing!"
        }
