# AI Internship Navigator 🎯

A **Multi-Agent AI System** that automates the internship application process for students in Pakistan — from discovering opportunities to generating tailored resumes and cover letters.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS (Vite) |
| Backend | FastAPI |
| Database | MongoDB |
| AI Agents | LangChain |
| LLM | Hugging Face / Ollama (open-source) |
| Web Scraping | Playwright |
| Resume Parsing | PyMuPDF |
| Auth | JWT Tokens |
| Deployment | Vercel (Frontend) · Render (Backend) |

---

## Project Structure

```
GenAI-Project/
├── frontend/          # React + Tailwind CSS (Vite)
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Application pages/views
│       ├── hooks/         # Custom React hooks
│       ├── context/       # React Context providers
│       ├── services/      # Axios API service layer
│       ├── utils/         # Helper functions
│       └── constants/     # Routes, enums, API endpoints
│
└── backend/           # FastAPI + MongoDB + LangChain
    └── app/
        ├── models/        # MongoDB document models
        ├── schemas/       # Pydantic request/response schemas
        ├── routers/       # FastAPI route handlers
        ├── agents/        # LangChain AI agents
        ├── services/      # Business logic (auth, scraper, LLM, parser)
        ├── middleware/    # JWT auth, CORS
        └── utils/         # Shared helpers
```

---

## Agents

| Agent | Responsibility |
|---|---|
| **Discovery Agent** | Scrapes internships from LinkedIn, Rozee.pk, Mustakbil using Playwright |
| **Matching Agent** | Scores resume against job description using LLM |
| **Tailoring Agent** | Generates a customized resume for a specific internship |
| **Cover Letter Agent** | Writes a personalized cover letter |
| **Tracker Agent** | Manages application status (Applied → Interview → Accepted/Rejected) |

---

## Git Workflow

```
main          ← stable scaffold (this branch)
  └── dev/your-name   ← each member works on their own branch
```

**Steps to start working:**
```bash
git clone https://github.com/UmerMujahid/GenAI-Project.git
cd GenAI-Project
git checkout -b dev/your-name
```

**When done with a feature, open a Pull Request targeting main.**

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Requires Node.js 18+

---

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Requires Python 3.10+ and a running MongoDB instance.

---

## Environment Variables

Copy .env.example to .env in both frontend/ and backend/ and fill in your values.

Backend .env keys:
- MONGO_URI=mongodb://localhost:27017
- DB_NAME=internship_navigator
- JWT_SECRET=your_secret_key
- JWT_EXPIRE_MINUTES=60
- HF_API_TOKEN=your_huggingface_token
- OLLAMA_BASE_URL=http://localhost:11434

Frontend .env keys:
- VITE_API_BASE_URL=http://localhost:8000

---

## Team

| Member | Module |
|---|---|
| Member 1 | Frontend (React pages + components) |
| Member 2 | Backend (FastAPI routers + models + auth) |
| Member 3 | AI Agents (LangChain + scraper + LLM) |
