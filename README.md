# AI Internship Navigator 🎯

An intelligent **Multi-Agent Career Intelligence System** designed for computer science and software engineering students across Pakistan — automating resume extraction, live job discovery via JobSpy (Indeed, LinkedIn, Google Jobs), and AI fit scoring powered by Groq and LangChain.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **Backend API** | FastAPI, Python 3.10+, Uvicorn |
| **Database** | MongoDB + Beanie ODM (Async Motor) |
| **AI LLM Engine** | LangChain + Groq (`openai/gpt-oss-120b`) |
| **Live Job Scraping** | Python JobSpy (`python-jobspy`) — Indeed, LinkedIn, Google Jobs |
| **Resume Parser** | PyMuPDF (`fitz`) + Groq Agent Extraction |
| **Authentication** | JWT (JSON Web Tokens) with Passlib bcrypt |

---

## 🚀 Quick Start Guide for Team Members

Follow these simple steps to set up and run the project on your local machine:

### Prerequisites
Make sure you have installed:
1. **Python 3.10+** ([Download Python](https://www.python.org/downloads/))
2. **Node.js 18+ & npm** ([Download Node.js](https://nodejs.org/))
3. **MongoDB** (Run locally via [MongoDB Community Server](https://www.mongodb.com/try/download/community) or use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
4. **Free Groq API Key** ([Get your free key here](https://console.groq.com/keys))

---

### Step 1: Clone Repository
```bash
git clone https://github.com/UmerMujahid/GenAI-Project.git
cd GenAI-Project
```

---

### Step 2: Backend Setup & API Key Configuration

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install all required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create your `.env` file:
   - Copy `.env.example` to `.env`:
     ```powershell
     # Windows PowerShell:
     Copy-Item .env.example .env
     
     # macOS / Linux:
     cp .env.example .env
     ```

5. Edit `backend/.env` with your settings:
   ```env
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=internship_navigator
   JWT_SECRET=super_secret_jwt_key_change_in_production_987654321
   JWT_EXPIRE_MINUTES=1440

   # Paste your free Groq API key:
   GROQ_API_KEY=gsk_your_actual_groq_key_here
   GROQ_MODEL=openai/gpt-oss-120b
   ```

6. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   > FastAPI will be live at: **http://localhost:8000** (Swagger API Docs at **http://localhost:8000/docs**)

---

### Step 3: Frontend Setup

1. Open a **second terminal** and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   > The web app will be live at: **http://localhost:5173**

---

## 🤖 Active AI Agents Architecture

```
GenAI-Project/
├── ai/
│   ├── agents/
│   │   ├── resume_parser_agent.py   # Agent 1: Extracts structured skills, contact, experience from PDF
│   │   └── job_discovery_agent.py   # Agent 2: Scrapes live jobs via JobSpy & computes AI fit scores
│   ├── prompts/
│   │   ├── resume_parser_prompt.py  # Prompt for structured PDF schema extraction
│   │   └── job_matching_prompt.py   # Prompt for realistic match score & gap analysis
│   └── tools/
│       └── pdf_reader.py            # PyMuPDF binary text extraction
│
├── backend/
│   ├── app/
│   │   ├── api/                     # FastAPI endpoint routers (auth, resume, jobs, internships)
│   │   ├── core/                    # App configuration and MongoDB initialization
│   │   ├── models/                  # Beanie ODM documents (User, Resume, MatchedJob)
│   │   └── schemas/                 # Pydantic schemas
│   ├── requirements.txt             # Python packages
│   └── .env.example                 # Environment variables template
│
└── frontend/
    └── src/
        ├── components/
        │   ├── dashboard/           # Modular dashboard (Header, Overview, ResumeParser, JobFinder)
        │   ├── landing/             # Hero, Insights, Features, Footer
        │   └── layout/              # Navbar
        ├── pages/                   # Main views (Dashboard, Login, Signup, AboutUs)
        └── services/api.ts          # Central Axios HTTP client
```

---

## 🔑 How to Get a Free Groq API Key
1. Sign up at [https://console.groq.com](https://console.groq.com)
2. Go to **API Keys** → **Create API Key**
3. Copy the key (starts with `gsk_...`) and paste it into `backend/.env` under `GROQ_API_KEY`.
