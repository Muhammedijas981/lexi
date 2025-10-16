from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import schemas

router = APIRouter()

@router.post("/match-template")
async def find_matching_template(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    """Find matching template - placeholder"""
    return {"message": "Template matching endpoint - to be implemented"}

@router.post("/generate-questions")
async def get_questions(template_id: int, answers: dict, db: Session = Depends(get_db)):
    """Generate questions - placeholder"""
    return {"questions": []}
