import re
import fitz  # PyMuPDF
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from beanie import PydanticObjectId
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse

router = APIRouter(prefix="/resume", tags=["Resume"])

def parse_resume_text(text: str) -> Dict[str, Any]:
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    
    # 1. Contact Details Parsing via Regex
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    linkedin_match = re.search(r'(https?://)?(www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+/?', text, re.IGNORECASE)
    github_match = re.search(r'(https?://)?(www\.)?github\.com/[a-zA-Z0-9_-]+/?', text, re.IGNORECASE)
    
    name = lines[0] if lines else "Candidate"
    contact_info = {
        "name": name,
        "email": email_match.group(0) if email_match else "",
        "phone": phone_match.group(0) if phone_match else "",
        "linkedin": linkedin_match.group(0) if linkedin_match else "",
        "github": github_match.group(0) if github_match else "",
        "location": "Pakistan"
    }
    
    # 2. Known Technical Skills Keyword List
    known_skills = [
        "Python", "JavaScript", "TypeScript", "React", "Node.js", "FastAPI", "Express", 
        "MongoDB", "PostgreSQL", "SQL", "HTML", "CSS", "Tailwind CSS", "Git", "GitHub", 
        "Docker", "C++", "Java", "PyTorch", "TensorFlow", "LangChain", "REST API", 
        "Machine Learning", "Data Structures", "OOP", "Vite", "Next.js", "Redux", "Linux"
    ]
    extracted_skills = []
    for skill in known_skills:
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            extracted_skills.append(skill)
            
    # 3. Simple Section Extraction Heuristics
    education = []
    experience = []
    projects = []
    certifications = []
    volunteer_work = []
    
    current_section = None
    for line in lines:
        lower_line = line.lower()
        if any(h in lower_line for h in ["education", "academic"]):
            current_section = "education"
            continue
        elif any(h in lower_line for h in ["experience", "work history", "employment"]):
            current_section = "experience"
            continue
        elif any(h in lower_line for h in ["project", "personal projects"]):
            current_section = "projects"
            continue
        elif any(h in lower_line for h in ["certification", "certificate", "license"]):
            current_section = "certifications"
            continue
        elif any(h in lower_line for h in ["volunteer", "leadership", "extracurricular"]):
            current_section = "volunteer"
            continue
        elif any(h in lower_line for h in ["skills", "technical skills"]):
            current_section = "skills"
            continue

        if current_section == "education" and len(education) < 4:
            education.append({"details": line})
        elif current_section == "experience" and len(experience) < 5:
            experience.append({"description": line})
        elif current_section == "projects" and len(projects) < 5:
            projects.append({"title": line})
        elif current_section == "certifications" and len(certifications) < 5:
            certifications.append(line)
        elif current_section == "volunteer" and len(volunteer_work) < 4:
            volunteer_work.append({"activity": line})

    return {
        "contact_info": contact_info,
        "skills": list(set(extracted_skills)),
        "education": education,
        "experience": experience,
        "projects": projects,
        "certifications": certifications,
        "volunteer_work": volunteer_work
    }

@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(user_id: str, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    try:
        contents = await file.read()
        pdf_document = fitz.open(stream=contents, filetype="pdf")
        extracted_text = ""
        for page in pdf_document:
            extracted_text += page.get_text()
        pdf_document.close()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse PDF resume: {str(e)}"
        )

    parsed_data = parse_resume_text(extracted_text)

    resume = Resume(
        user_id=PydanticObjectId(user_id),
        filename=file.filename,
        raw_text=extracted_text,
        contact_info=parsed_data["contact_info"],
        skills=parsed_data["skills"],
        education=parsed_data["education"],
        experience=parsed_data["experience"],
        projects=parsed_data["projects"],
        certifications=parsed_data["certifications"],
        volunteer_work=parsed_data["volunteer_work"]
    )
    await resume.insert()

    return ResumeResponse(
        id=str(resume.id),
        user_id=str(resume.user_id),
        filename=resume.filename,
        contact_info=resume.contact_info,
        skills=resume.skills,
        education=resume.education,
        experience=resume.experience,
        projects=resume.projects,
        certifications=resume.certifications,
        volunteer_work=resume.volunteer_work,
        raw_text=resume.raw_text,
        created_at=resume.created_at
    )

@router.get("/user/{user_id}", response_model=Optional[ResumeResponse])
async def get_latest_resume(user_id: str):
    try:
        obj_id = PydanticObjectId(user_id)
        resume = await Resume.find_one(Resume.user_id == obj_id, sort=[("created_at", -1)])
        if not resume:
            return None
        return ResumeResponse(
            id=str(resume.id),
            user_id=str(resume.user_id),
            filename=resume.filename,
            contact_info=resume.contact_info or {},
            skills=resume.skills or [],
            education=resume.education or [],
            experience=resume.experience or [],
            projects=resume.projects or [],
            certifications=resume.certifications or [],
            volunteer_work=resume.volunteer_work or [],
            raw_text=resume.raw_text or "",
            created_at=resume.created_at
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
