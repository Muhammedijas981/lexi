from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter()

@router.post("/", response_model=schemas.Template)
def create_template(template: schemas.TemplateCreate, db: Session = Depends(get_db)):
    """Create a new template"""
    
    # Create template
    db_template = models.Template(
        template_id=template.template_id,
        title=template.title,
        description=template.description,
        doc_type=template.doc_type,
        jurisdiction=template.jurisdiction,
        similarity_tags=template.similarity_tags,
        body_md=template.body_md
    )
    db.add(db_template)
    db.commit()
    
    # Create variables
    for var in template.variables:
        db_var = models.TemplateVariable(
            template_id=template.template_id,
            key=var.key,
            label=var.label,
            description=var.description,
            example=var.example,
            required=var.required,
            dtype=var.dtype,
            regex=var.regex,
            enum=var.enum
        )
        db.add(db_var)
    
    db.commit()
    db.refresh(db_template)
    
    return db_template

@router.get("/", response_model=List[schemas.Template])
def get_templates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all templates"""
    templates = db.query(models.Template).offset(skip).limit(limit).all()
    return templates

@router.get("/{template_id}", response_model=schemas.Template)
def get_template(template_id: str, db: Session = Depends(get_db)):
    """Get a specific template"""
    template = db.query(models.Template).filter(models.Template.template_id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template
