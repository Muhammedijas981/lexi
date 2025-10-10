from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Template(Base):
    __tablename__ = "templates"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    doc_type = Column(String, index=True)
    jurisdiction = Column(String, index=True)
    similarity_tags = Column(JSON)  # List of strings
    body_md = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    variables = relationship("TemplateVariable", back_populates="template", cascade="all, delete-orphan")
    instances = relationship("DraftInstance", back_populates="template", cascade="all, delete-orphan")

class TemplateVariable(Base):
    __tablename__ = "template_variables"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, ForeignKey("templates.template_id"))
    key = Column(String)
    label = Column(String)
    description = Column(Text)
    example = Column(String)
    required = Column(Boolean, default=False)
    dtype = Column(String, default="string")
    regex = Column(String, nullable=True)
    enum = Column(JSON, nullable=True)  # List of strings
    
    template = relationship("Template", back_populates="variables")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    mime_type = Column(String)
    raw_text = Column(Text)
    embedding = Column(JSON, nullable=True)  # Vector embedding
    created_at = Column(DateTime, default=datetime.utcnow)

class DraftInstance(Base):
    __tablename__ = "instances"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, ForeignKey("templates.template_id"))
    user_query = Column(Text)
    answers_json = Column(JSON)  # Dict of variable answers
    draft_md = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    template = relationship("Template", back_populates="instances")
