# Aegis Growth OS 🚀

> **The Best Student Growth Operating System**

Aegis Growth OS is a comprehensive, AI-powered platform designed to provide a holistic, growth-oriented learning experience for students. Built with a modern "Cyber-Zen" aesthetic and a dynamic Bento-grid layout, Aegis is more than just a dashboard—it's an intelligent companion that guides students on their educational journey.

## ✨ Features

- **Cyber-Zen Dashboard**: A responsive, visually stunning interface using modern web design principles and dynamic animations.
- **AI Roadmap Generator**: Powered by Gemini AI, it generates structured, personalized learning paths and roadmaps for students.
- **Concept Coach AI**: An interactive, hint-based AI mentor (powered by Gemini 2.5 Flash) designed to guide students through complex topics without just giving away the answers.
- **Mastery Validation System**: A psychology-aware assessment approach to ensure true understanding and retention of concepts.

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

2. Install all required Node.js dependencies:
   ```bash
   npm install
   ```

3. Boot up the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be running locally at `http://localhost:5173`.*

---

## 🤝 Contributing
Contributions are welcome! Feel free to fork this repository, create a branch, and submit a pull request with your improvements.