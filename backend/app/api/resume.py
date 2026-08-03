import fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from beanie import PydanticObjectId
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse

router = APIRouter(prefix="/resume", tags=["Resume"])

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

    resume = Resume(
        user_id=PydanticObjectId(user_id),
        filename=file.filename,
        raw_text=extracted_text,
        parsed_skills=[],
        parsed_experience=[]
    )
    await resume.insert()

    return ResumeResponse(
        id=str(resume.id),
        user_id=str(resume.user_id),
        filename=resume.filename,
        parsed_skills=resume.parsed_skills,
        parsed_experience=resume.parsed_experience,
        created_at=resume.created_at
    )
