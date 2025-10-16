from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class VariableBase(BaseModel):
    key: str
    label: str
    description: Optional[str] = None
    example: Optional[str] = None
    required: bool = True
    dtype: str = "string"
    regex_pattern: Optional[str] = None
    enum_values: Optional[List[str]] = None

class VariableCreate(VariableBase):
    pass

class Variable(VariableBase):
    id: int
    template_id: int
    
    class Config:
        from_attributes = True

class TemplateBase(BaseModel):
    template_id: str
    title: str
    file_description: Optional[str] = None
    doc_type: str
    jurisdiction: Optional[str] = None
    similarity_tags: List[str] = []
    body_md: str

class TemplateCreate(TemplateBase):
    variables: List[VariableCreate] = []

class Template(TemplateBase):
    id: int
    created_at: datetime
    variables: List[Variable] = []
    
    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    filename: str
    mime_type: str
    raw_text: str

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    query: str

class GenerateDraftRequest(BaseModel):
    template_id: int
    answers: Dict[str, Any]

class DraftResponse(BaseModel):
    draft_md: str
    template_id: str
    instance_id: int
