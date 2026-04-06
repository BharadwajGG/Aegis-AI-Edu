# Edge Edu (Aegis Growth OS) 🚀

> **The Best Student Growth Operating System**

Aegis Growth OS is a comprehensive, AI-powered platform designed to provide a holistic, growth-oriented learning experience for students. Built with a modern "Cyber-Zen" aesthetic and a dynamic Bento-grid layout, Aegis is more than just a dashboard—it's an intelligent companion that guides students on their educational journey.

## ✨ Features

- **Cyber-Zen Dashboard**: A responsive, visually stunning interface using modern web design principles and dynamic animations.
- **AI Roadmap Generator**: Powered by Gemini AI, it generates structured, personalized learning paths and roadmaps for students.
- **Concept Coach AI**: An interactive, hint-based AI mentor (powered by Gemini 2.5 Flash) designed to guide students through complex topics without just giving away the answers.
- **Mastery Validation System**: A psychology-aware assessment approach to ensure true understanding and retention of concepts.
- **Firebase Authentication**: Secure user login and a personalized dashboard experience with Google Auth integration.
- **Competitions & Events Feed**: Real-time listing of hackathons, seminars, and networking opportunities.
- **Community Groups**: College-specific hubs for tracking collaborative growth, accessing materials, and connecting with peers.
- **Dynamic Priority Ticker & Calendar**: Integrated scheduling engine to keep track of critical exams, opportunities, and deadlines.

---

## 🏗️ Architecture

Aegis is built with a modern, decoupled architecture:
- **Frontend**: React.js powered by Vite, providing a fast, responsive user interface.
- **Backend**: Python with FastAPI, delivering high-performance API endpoints and seamless AI integrations.

---

## 🛠️ Prerequisites

Ensure you have the following installed before running the project:
- [Node.js](https://nodejs.org/) (Recommended: v18+ for the frontend)
- [Python 3.10+](https://www.python.org/) (For the backend)
- **Git** (For version control)

---

## 🚀 Running the Project locally

To experience Aegis on your local machine, you will need to start both the Frontend and Backend development servers simultaneously. 

*Tip: You'll need two separate terminal/command prompt windows.*

### 1. Start the Backend (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd "backend"
   ```

2. **(Highly Recommended)** Create a virtual environment to manage dependencies:
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - **Windows:**
     ```bash
     .venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source .venv/bin/activate
     ```

4. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. **Environment Configuration**: Make sure you have your `.env` file set up in the `backend/` directory. It must contain your API keys (e.g., `GEMINI_API_KEY`).

6. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend should now be running on `http://localhost:8000`.*

---

### 2. Start the Frontend (React + Vite)

1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. **Environment Configuration**: Create a `.env` file in the `frontend/` directory containing your Firebase configuration credentials:
   ```env
   VITE_FIREBASE_API_KEY="your_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   ```

3. Install all required Node.js dependencies:
   ```bash
   npm install
   ```

4. Boot up the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be running locally at `http://localhost:5173`.*

---

## 🌍 Live Deployment

The Aegis Growth OS is currently deployed and accessible live. We utilize a modern deployment stack:

- **Frontend Hosting**: Deployed on [Vercel](https://vercel.com/) (pointing to `/frontend`).
- **Backend Hosting**: Deployed on [Render](https://render.com/) (pointing to `/backend`).

### Continuous Deployment (CI/CD)

Yes! Because the codebase is connected to Vercel and Render via your GitHub repository, **any changes you push to the `main` branch will automatically trigger a rebuild and reflect on the live deployed project within a few minutes**. You do not need to manually deploy every time you add a new feature.

1. Make your code changes locally.
2. Run `git add .`, `git commit -m "update"`, and `git push`.
3. Vercel and Render will automatically detect the new code and update your live site!

---

## 🤝 Contributing
Contributions are welcome! Feel free to fork this repository, create a branch, and submit a pull request with your improvements.