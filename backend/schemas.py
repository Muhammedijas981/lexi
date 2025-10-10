from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class TemplateVariableBase(BaseModel):
    key: str
    label: str
    description: str
    example: str
    required: bool = False
    dtype: str = "string"
    regex: Optional[str] = None
    enum: Optional[List[str]] = None

class TemplateVariableCreate(TemplateVariableBase):
    pass

class TemplateVariable(TemplateVariableBase):
    id: int
    template_id: str
    
    class Config:
        from_attributes = True

class TemplateBase(BaseModel):
    template_id: str
    title: str
    description: str
    doc_type: str
    jurisdiction: str
    similarity_tags: List[str]
    body_md: str

class TemplateCreate(TemplateBase):
    variables: List[TemplateVariableCreate]

class Template(TemplateBase):
    id: int
    created_at: datetime
    variables: List[TemplateVariable] = []
    
    class Config:
        from_attributes = True

class DocumentUploadResponse(BaseModel):
    document_id: int
    filename: str
    extracted_text: str
    variables: List[TemplateVariableCreate]

class TemplateMatchResponse(BaseModel):
    template: Template
    confidence_score: float
    reasoning: str

class ChatRequest(BaseModel):
    query: str

class GenerateDraftRequest(BaseModel):
    template_id: str
    answers: Dict[str, Any]

class DraftResponse(BaseModel):
    draft_md: str
    template_id: str
    instance_id: int
