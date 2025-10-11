from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services.template_engine import generate_draft
import models
import schemas

router = APIRouter()

@router.post("/generate", response_model=schemas.DraftResponse)
async def create_draft(request: schemas.GenerateDraftRequest, db: Session = Depends(get_db)):
    """Generate a draft document from template and answers"""
    
    # Get template
    template = db.query(models.Template).filter(
        models.Template.template_id == request.template_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Generate draft
    draft_md = generate_draft(template.body_md, request.answers)
    
    # Save instance
    instance = models.DraftInstance(
        template_id=request.template_id,
        user_query="",  # Store original query if available
        answers_json=request.answers,
        draft_md=draft_md
    )
    db.add(instance)
    db.commit()
    db.refresh(instance)
    
    return schemas.DraftResponse(
        draft_md=draft_md,
        template_id=request.template_id,
        instance_id=instance.id
    )
