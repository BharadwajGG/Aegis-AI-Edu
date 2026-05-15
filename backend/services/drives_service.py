import datetime
from typing import List, Dict, Optional

class DrivesService:
    def __init__(self):
        # Mock drive data
        self.drives = [
            {
                "id": "drive_1",
                "company_name": "Google",
                "logo": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                "role_offered": "Software Engineer Intern",
                "type": "Internship",
                "eligibility_criteria": "CS/IT, GPA > 8.0, 2026 Grad",
                "required_skills": ["Python", "DSA", "System Design"],
                "drive_date": (datetime.datetime.now() + datetime.timedelta(days=30)).isoformat(),
                "registration_deadline": (datetime.datetime.now() + datetime.timedelta(days=10)).isoformat(),
                "drive_mode": "Online",
                "location": "Remote",
                "package_stipend": "₹1,00,000 / month",
                "hiring_process": ["Online Test", "Technical Interview 1", "Technical Interview 2", "HR Interview"],
                "tags": ["AI/ML", "Cloud"]
            },
            {
                "id": "drive_2",
                "company_name": "Microsoft",
                "logo": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                "role_offered": "SDE-1",
                "type": "Full-Time",
                "eligibility_criteria": "Any Branch, GPA > 7.5, 2025 Grad",
                "required_skills": ["C++", "DSA", "Problem Solving"],
                "drive_date": (datetime.datetime.now() + datetime.timedelta(days=45)).isoformat(),
                "registration_deadline": (datetime.datetime.now() + datetime.timedelta(days=15)).isoformat(),
                "drive_mode": "Offline",
                "location": "Bangalore",
                "package_stipend": "₹25,00,000 LPA",
                "hiring_process": ["Aptitude Test", "Coding Round", "Technical Interviews", "Director Round"],
                "tags": ["Software", "Core"]
            },
            {
                "id": "drive_3",
                "company_name": "NVIDIA",
                "logo": "https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg",
                "role_offered": "AI Engineer",
                "type": "Full-Time",
                "eligibility_criteria": "CS/IT/ENTC, GPA > 8.5",
                "required_skills": ["PyTorch", "CUDA", "C++", "Mathematics"],
                "drive_date": (datetime.datetime.now() + datetime.timedelta(days=60)).isoformat(),
                "registration_deadline": (datetime.datetime.now() + datetime.timedelta(days=20)).isoformat(),
                "drive_mode": "Online",
                "location": "Pune",
                "package_stipend": "₹30,00,000 LPA",
                "hiring_process": ["Online Assessment", "Technical Rounds", "System Design", "HR"],
                "tags": ["AI/ML", "Graphics"]
            },
            {
                "id": "drive_4",
                "company_name": "Atlassian",
                "logo": "https://upload.wikimedia.org/wikipedia/commons/0/01/Atlassian_logo.svg",
                "role_offered": "Frontend Developer",
                "type": "Internship",
                "eligibility_criteria": "CS/IT, 2026 Grad",
                "required_skills": ["React", "JavaScript", "CSS", "UI/UX"],
                "drive_date": (datetime.datetime.now() + datetime.timedelta(days=15)).isoformat(),
                "registration_deadline": (datetime.datetime.now() + datetime.timedelta(days=5)).isoformat(),
                "drive_mode": "Online",
                "location": "Remote",
                "package_stipend": "₹80,000 / month",
                "hiring_process": ["Coding Challenge", "Frontend Round", "Cultural Fit"],
                "tags": ["Web", "Design"]
            }
        ]

    def get_upcoming_drives(self, months: int = 3) -> List[Dict]:
        now = datetime.datetime.now()
        future = now + datetime.timedelta(days=months * 30)
        
        upcoming = [
            drive for drive in self.drives 
            if now <= datetime.datetime.fromisoformat(drive["drive_date"]) <= future
        ]
        
        # Sort by registration deadline (closest first)
        upcoming.sort(key=lambda x: x["registration_deadline"])
        return upcoming

    def get_recommendations(self, student_profile: Dict) -> List[Dict]:
        """
        AI Personalization Engine: Prioritizes drives based on:
        - Student skill profile
        - Career interests
        - Academic performance (GPA)
        """
        skills = student_profile.get("skills", [])
        interests = student_profile.get("interests", [])
        gpa = student_profile.get("gpa", 0.0)
        
        scored_drives = []
        for drive in self.drives:
            score = 0
            
            # Skill match
            matching_skills = set(skills).intersection(set(drive["required_skills"]))
            score += len(matching_skills) * 10
            
            # Interest match
            matching_interests = set(interests).intersection(set(drive.get("tags", [])))
            score += len(matching_interests) * 15
            
            # Eligibility check (Simplified)
            if gpa >= 8.0:
                score += 5
            
            scored_drives.append({**drive, "recommendation_score": score})
            
        # Sort by score descending
        scored_drives.sort(key=lambda x: x["recommendation_score"], reverse=True)
        return scored_drives

    def get_preparation_roadmap(self, drive_id: str) -> Dict:
        drive = next((d for d in self.drives if d["id"] == drive_id), None)
        if not drive:
            return {"error": "Drive not found"}
        
        # Mock AI generated roadmap
        return {
            "drive_id": drive_id,
            "company": drive["company_name"],
            "roadmap": [
                {"day": 1, "task": f"Brush up on {', '.join(drive['required_skills'][:2])} fundamentals."},
                {"day": 2, "task": "Solve 5 medium-level DSA questions on LeetCode."},
                {"day": 3, "task": f"Study {drive['company_name']}'s recent interview experiences."},
                {"day": 4, "task": "Mock interview session with AI Coach."},
                {"day": 5, "task": "Review Resume and projects related to this role."}
            ],
            "recommended_questions": [
                "Reverse a Linked List",
                "Implement a LRU Cache",
                "System Design for a Chat App (Scaling)",
                "Explain the CAP theorem"
            ],
            "resume_tips": [
                f"Highlight projects using {drive['required_skills'][0]}.",
                "Quantify your achievements (e.g., 'Reduced latency by 20%')."
            ]
        }

    def check_eligibility(self, drive_id: str, student_profile: Dict) -> Dict:
        drive = next((d for d in self.drives if d["id"] == drive_id), None)
        if not drive:
            return {"error": "Drive not found"}
        
        gpa = student_profile.get("gpa", 0.0)
        skills = student_profile.get("skills", [])
        
        # Simplified eligibility logic
        is_eligible = gpa >= 7.5 # Generic threshold for mock
        
        missing_requirements = []
        if gpa < 8.0 and "GPA > 8.0" in drive["eligibility_criteria"]:
            missing_requirements.append("Academic GPA (Minimum 8.0 required)")
            
        missing_skills = [s for s in drive["required_skills"] if s not in skills]
        
        return {
            "drive_id": drive_id,
            "is_eligible": is_eligible and not missing_requirements,
            "missing_requirements": missing_requirements,
            "missing_skills": missing_skills,
            "suggestions": [
                f"Take a crash course on {s} to bridge the skill gap." for s in missing_skills
            ]
        }

    def get_label_mate_insight(self, drive_id: str, student_profile: Dict) -> Dict:
        drive = next((d for d in self.drives if d["id"] == drive_id), None)
        if not drive:
            return {"error": "Drive not found"}
        
        # In a real app, this would call the AI service. 
        # For now, we'll return the mock structure that the AI service would produce.
        # This allows the frontend to be developed even if Gemini is not active.
        from services.ai_service import generate_label_mate_insight
        return generate_label_mate_insight(drive, student_profile)

drives_service = DrivesService()
