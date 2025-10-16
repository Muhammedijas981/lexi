from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services.ai_service import match_template, generate_questions
import schemas

router = APIRouter()

@router.post("/match-template", response_model=schemas.TemplateMatchResponse)
async def find_matching_template(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    """Find the best matching template for user query"""
    
    result = await match_template(request.query, db)
    
    if not result:
        raise HTTPException(status_code=404, detail="No matching template found")
    
    return result

@router.post("/generate-questions")
async def get_questions(template_id: str, answers: dict, db: Session = Depends(get_db)):
    """Generate human-friendly questions for missing variables"""
    
    questions = await generate_questions(template_id, answers, db)
    return {"questions": questions}
