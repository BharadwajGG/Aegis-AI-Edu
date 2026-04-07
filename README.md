<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg" alt="Aegis Logo" width="80" height="80">
  <h1 align="center">AEGIS Growth OS</h1>
  <p align="center">
    <strong>The Next-Generation AI-Powered Learning Engine</strong>
  </p>
  <p align="center">
    <a href="#"><img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"></a>
    <a href="#"><img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"></a>
    <a href="#"><img src="https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI"></a>
    <a href="#"><img src="https://img.shields.io/badge/Auth-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase"></a>
  </p>
</div>

---

## 🎯 The Vision
Modern education platforms are boring. They treat students like data points rather than humans who need motivation, psychology, and gamification to thrive.

**Aegis Growth OS** is a visually stunning, highly resilient "Cyber-Zen" dashboard. It seamlessly blends *Growth Mode* (nurturing, personalized roadmaps, progressive hinting) and *Competitive Mode* (leaderboards, global rankings, heatmap activity tracking) to adapt to the student's current psychological state.

## ✨ Core Features

🛡️ **Progressive AI Concept Coach**
We don't wrap ChatGPT. Our backend intercepts the student's question and forces the Google Gemini AI to return structured JSON. The UI renders this sequentially: breaking down Broad Hints, Specific Nudges, and finally the Direct Answer, forcing genuine *Socratic learning* instead of cheating.

🗺️ **Dynamic AI Curriculum Generative Roadmaps**
Type your end goal, and Aegis returns a beautifully mapped, step-by-step curriculum dynamically structured to your learning pace (Beginner to Intensive).

🔥 **GitHub-Style Consistency Tracker Heatmap**
Students are held accountable via a brutal visual reality check—a massive 365-day heat map built completely natively via CSS Flexbox charting to track their velocity without heavy external libraries.

🎭 **Ghost Mode (Privacy & Focus)**
Social comparison causes anxiety. With a single click, students can blur their avatars and replace their identity with randomized "Ghost Names" to purely focus on learning.

## 🏗️ The Architecture
We maintain extremely high speeds by completely decoupling the architecture:
- **Frontend:** React + Vite (Lightning fast DOM updates and Framer Motion micro-animations).
- **Backend:** Python + FastAPI (Native data/AI integration mapping directly to Google's SDK without rate-limiting the client).

## 🚀 Quick Start Guide

### 1. Run the Backend
```bash
cd backend
python -m venv .venv
# Activate venv: .venv\Scripts\activate (Windows) OR source .venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
uvicorn main:app --reload
```
*Note: Make sure your `.env` contains your `GEMINI_API_KEY`.*

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Note: Ensure your `.env` contains your Firebase Config keys.*

## 🌍 Live Deployment
Pushing to the `main` branch automatically triggers our CI/CD pipelines!
- **Frontend** hosted instantly globally on **Vercel**.
- **Backend API** runs smoothly on **Render/Railway**.