# AI Internship Navigator

An intelligent **Multi-Agent Career Intelligence System** designed for computer science and software engineering students across Pakistan. The platform automates resume extraction, live job discovery via JobSpy (Indeed, LinkedIn, Google Jobs), AI fit scoring, resume tailoring, and cover letter generation powered by Groq and LangChain.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **Backend API** | FastAPI, Python 3.10+, Uvicorn |
| **Database** | MongoDB + Beanie ODM (Async Motor) |
| **AI LLM Engine** | LangChain + Groq (`openai/gpt-oss-120b`) |
| **Live Job Scraping** | Python JobSpy (`python-jobspy`) — Indeed, LinkedIn, Google Jobs |
| **Resume Parser** | PyMuPDF (`fitz`) + Groq Agent Extraction |
| **Document Export** | ReportLab PDF generation (tailored resume and cover letter) |
| **Authentication** | JWT (JSON Web Tokens) with Passlib bcrypt |

---

## Quick Start Guide for Team Members

Follow these steps to set up and run the project on your local machine.

### Prerequisites

Make sure you have installed:

1. **Python 3.10+** ([Download Python](https://www.python.org/downloads/))
2. **Node.js 18+ and npm** ([Download Node.js](https://nodejs.org/))
3. **MongoDB** (local [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
4. **Free Groq API Key** ([Get your free key here](https://console.groq.com/keys))

---

### Step 1: Clone Repository

```bash
git clone https://github.com/UmerMujahid/GenAI-Project.git
cd GenAI-Project
```

---

### Step 2: Backend Setup and API Key Configuration

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

4. Create your `.env` file from the example template:

   ```bash
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

   FastAPI will be available at **http://localhost:8000** (Swagger docs at **http://localhost:8000/docs**).

---

### Step 3: Frontend Setup

1. Open a second terminal and navigate to `frontend`:

   ```bash
   cd frontend
   ```

2. Install npm dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

   The web app will be available at **http://localhost:5173**.

---

## Active AI Agents Architecture

```
GenAI-Project/
├── ai/
│   ├── agents/
│   │   ├── resume_parser_agent.py    # Agent 1: Structured resume extraction from PDF
│   │   ├── job_discovery_agent.py    # Agent 2: Live job scraping + fit scoring
│   │   ├── resume_tailor_agent.py    # Agent 3a: Job-targeted resume rewriting
│   │   └── cover_letter_agent.py     # Agent 3b: Targeted cover letter drafting
│   ├── prompts/
│   │   ├── resume_parser_prompt.py
│   │   ├── job_matching_prompt.py
│   │   ├── resume_tailor_prompt.py
│   │   └── cover_letter_prompt.py
│   └── tools/
│       └── pdf_reader.py             # PyMuPDF binary text extraction
│
├── backend/
│   ├── app/
│   │   ├── api/                      # FastAPI routers (auth, resume, jobs, agents)
│   │   ├── core/                     # Config, MongoDB init, PDF export helpers
│   │   ├── models/                   # Beanie ODM documents
│   │   └── schemas/                  # Pydantic request/response schemas
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    └── src/
        ├── components/
        │   ├── dashboard/            # Overview, ResumeParser, JobFinder, Agent modals
        │   ├── landing/              # Marketing / landing sections
        │   └── layout/               # Navbar and shared chrome
        ├── pages/                    # Dashboard, Login, Signup, AboutUs
        └── services/api.ts           # Central Axios HTTP client
```

---

## How to Get a Free Groq API Key

1. Sign up at [https://console.groq.com](https://console.groq.com)
2. Open **API Keys** and create a new key
3. Copy the key (it starts with `gsk_...`) and paste it into `backend/.env` as `GROQ_API_KEY`
