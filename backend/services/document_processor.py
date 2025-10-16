from fastapi import UploadFile, HTTPException
import PyPDF2
from docx import Document as DocxDocument
import io
import logging

logger = logging.getLogger(__name__)

class DocumentProcessor:
    """Service for processing document files (PDF/DOCX)"""
    
    def __init__(self):
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        self.allowed_types = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
    
    async def validate_file(self, file: UploadFile):
        """Validate uploaded file"""
        if file.content_type not in self.allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are allowed"
            )
        
        # Check file size
        content = await file.read()
        await file.seek(0)  # Reset file pointer
        
        if len(content) > self.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds {self.max_file_size / 1024 / 1024}MB limit"
            )
    
    async def extract_text(self, file: UploadFile) -> str:
        """Extract text from PDF or DOCX"""
        content = await file.read()
        await file.seek(0)
        
        if file.content_type == "application/pdf":
            return self._extract_from_pdf(content)
        else:
            return self._extract_from_docx(content)
    
    def _extract_from_pdf(self, content: bytes) -> str:
        """Extract text from PDF"""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"PDF extraction error: {e}")
            raise HTTPException(status_code=400, detail="Failed to extract text from PDF")
    
    def _extract_from_docx(self, content: bytes) -> str:
        """Extract text from DOCX"""
        try:
            doc = DocxDocument(io.BytesIO(content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"DOCX extraction error: {e}")
            raise HTTPException(status_code=400, detail="Failed to extract text from DOCX")
    
    def get_file_info(self, file: UploadFile) -> dict:
        """Get basic file information"""
        return {
            "filename": file.filename,
            "mime_type": file.content_type,
            "file_size": file.size if hasattr(file, 'size') else 0
        }
    
    async def chunk_document(self, text: str, chunk_size: int = 3000) -> List[str]:
        """Split long documents into chunks for processing"""
        if len(text) <= chunk_size:
            return [text]
        
        chunks = []
        words = text.split()
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
