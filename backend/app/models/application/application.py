from datetime import datetime

# A helper function to generate the dictionary format 
def create_application_document(user_id: str, job_id: str, resume_id: str):
    return {
        "user_id": user_id,
        "job_id": job_id,
        "status": "Pending", # Default status
        "resume_id": resume_id,
        "cover_letter_id": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }