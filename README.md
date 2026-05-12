# Aegis AI - Student Growth OS

Aegis AI is a premium, AI-powered education dashboard designed for students to master complex concepts, generate intelligent roadmaps, and track their performance in real-time.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Node.js**: [Download and install Node.js](https://nodejs.org/) (Version 18 or higher)
- **Python**: [Download and install Python](https://www.python.org/) (Version 3.12 or higher)

---

## 🛠️ Installation & Setup

### 1. Backend Setup (FastAPI)

The backend handles AI roadmap generation and concept coaching using the Gemini API.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment:**
    - **Windows:**
      ```bash
      .\venv\Scripts\activate
      ```
    - **macOS/Linux:**
      ```bash
      source venv/bin/activate
      ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Configure environment variables:**
    Create a `.env` file in the `backend` folder and add your Gemini API Key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

### 3. Setup Authentication (Firebase)
To enable real-time authentication:
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Google & Email/Password).
3. Create a **Firestore** database.
4. Copy `frontend/.env.example` to `frontend/.env` and fill in your credentials.

---

### 2. Frontend Setup (React + Vite)

The frontend is a high-performance dashboard built with React and Tailwind CSS.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

---

## 🌟 Key Features

- **AI Roadmap Generator**: Enter any learning objective to receive a structured, multi-phase curriculum.
- **Concept Coach**: Paste complex problems to receive progressive Socratic hints instead of immediate spoilers.
- **Growth & Competitive Modes**: Toggle between a focused learning environment and a competitive leaderboard view.
- **Consistency Tracker**: Visualized contribution graph to track daily learning streaks.
- **Live Leaderboard**: Real-time performance tracking with global ranking.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts.
- **Backend**: FastAPI, Python, Uvicorn, Google Generative AI (Gemini).
- **Authentication**: Firebase Auth integration.

---

## © License
Aegis AI © 2026. All rights reserved.
