from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Template(Base):
    __tablename__ = "templates"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    file_description = Column(Text, nullable=True)
    doc_type = Column(String, index=True)
    jurisdiction = Column(String, index=True, nullable=True)
    similarity_tags = Column(JSON)
    body_md = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    variables = relationship("TemplateVariable", back_populates="template", cascade="all, delete-orphan")
    instances = relationship("DraftInstance", back_populates="template", cascade="all, delete-orphan")

class TemplateVariable(Base):
    __tablename__ = "template_variables"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("templates.id"))
    key = Column(String)
    label = Column(String)
    description = Column(Text, nullable=True)
    example = Column(String, nullable=True)
    required = Column(Boolean, default=False)
    dtype = Column(String, default="string")
    regex_pattern = Column(String, nullable=True)
    enum_values = Column(JSON, nullable=True)
    
    template = relationship("Template", back_populates="variables")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    mime_type = Column(String)
    raw_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class DraftInstance(Base):
    __tablename__ = "instances"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("templates.id"))
    user_query = Column(Text, nullable=True)
    answers_json = Column(JSON)
    draft_md = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    template = relationship("Template", back_populates="instances")
