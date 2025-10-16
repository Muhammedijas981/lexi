from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services.document_processor import process_document
from services.ai_service import extract_variables
import models
import schemas

router = APIRouter()

@router.post("/upload", response_model=schemas.DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and process a legal document (DOCX/PDF)"""
    
    # Validate file type
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are allowed")
    
    # Process document
    text_content = await process_document(file)
    
    # Extract variables using Gemini
    variables = await extract_variables(text_content)
    
    # Save document to database
    document = models.Document(
        filename=file.filename,
        mime_type=file.content_type,
        raw_text=text_content
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return schemas.DocumentUploadResponse(
        document_id=document.id,
        filename=document.filename,
        extracted_text=text_content[:500] + "...",  # Preview
        variables=variables
    )
