import json
import google.generativeai as genai
from config import settings

# Initialize Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

# Use the recommended model for fast and structured text generation
model = genai.GenerativeModel('gemini-2.5-flash')

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

def generate_roadmap_json(goal: str, level: str, mode: str) -> dict:
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
        print(f"Error calling Gemini: {e}")
        # Send a fallback structured JSON on failure
        return {
            "roadmap": {
                "title": f"Failed to generate roadmap for {goal}",
                "summary": "Our AI service encountered an error. Please check your API key and try again.",
                "phases": []
            }
        }
