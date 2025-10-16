from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter()

@router.post("/generate", response_model=schemas.DraftResponse)
async def create_draft(request: schemas.GenerateDraftRequest, db: Session = Depends(get_db)):
    """Generate draft - placeholder"""
    
    template = db.query(models.Template).filter(models.Template.id == request.template_id).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Simple variable replacement
    draft = template.body_md
    for key, value in request.answers.items():
        draft = draft.replace(f"{{{{{key}}}}}", str(value))
    
    # Save instance
    instance = models.DraftInstance(
        template_id=template.id,
        user_query="",
        answers_json=request.answers,
        draft_md=draft
    )
    db.add(instance)
    db.commit()
    db.refresh(instance)
    
    return schemas.DraftResponse(
        draft_md=draft,
        template_id=template.template_id,
        instance_id=instance.id
    )
