from fastapi import UploadFile
import PyPDF2
from docx import Document as DocxDocument
import io

async def process_document(file: UploadFile) -> str:
    """
    Extract text from DOCX or PDF files
    """
    content = await file.read()
    
    if file.content_type == "application/pdf":
        return extract_text_from_pdf(content)
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return extract_text_from_docx(content)
    else:
        raise ValueError("Unsupported file type")

def extract_text_from_pdf(content: bytes) -> str:
    """Extract text from PDF"""
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = ""
    
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    
    return text.strip()

def extract_text_from_docx(content: bytes) -> str:
    """Extract text from DOCX"""
    doc = DocxDocument(io.BytesIO(content))
    text = ""
    
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    
    return text.strip()

def chunk_text(text: str, chunk_size: int = 3000) -> list[str]:
    """
    Split long documents into chunks for processing
    Important: Used for handling long documents with Gemini
    """
    words = text.split()
    chunks = []
    current_chunk = []
    current_size = 0
    
    for word in words:
        current_size += len(word) + 1
        if current_size > chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_size = len(word)
        else:
            current_chunk.append(word)
    
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    return chunks
