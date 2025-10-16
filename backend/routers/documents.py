from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import logging
import io

from database import get_db
from models import Document as DocumentModel

logger = logging.getLogger(__name__)

router = APIRouter()

# Document processor class
class DocumentProcessor:
    async def validate_file(self, file: UploadFile):
        allowed_types = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files allowed")
    
    async def extract_text(self, file: UploadFile) -> str:
        content = await file.read()
        await file.seek(0)
        
        if file.content_type == "application/pdf":
            import PyPDF2
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        else:
            from docx import Document
            doc = Document(io.BytesIO(content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()

# AI service class
class AIService:
    async def extract_variables(self, text: str):
        import google.generativeai as genai
        from config import settings
        import json
        import re
        
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Extract ALL variables from this legal document. Return JSON only.

Rules:
- Use snake_case keys (landlord_name, monthly_rent, incident_date)
- Identify: parties, dates, amounts, addresses, IDs, contacts
- Don't variabilize legal statutes

Document:
{text[:4000]}

Return ONLY this JSON format:
{{
  "variables": [
    {{
      "key": "landlord_name",
      "label": "Landlord's Name",
      "description": "Full name of landlord",
      "example": "John Doe",
      "required": true,
      "dtype": "string"
    }}
  ]
}}"""

        try:
            response = model.generate_content(prompt)
            if response and hasattr(response, 'text'):
                json_match = re.search(r'\{[\s\S]*\}', response.text)
                if json_match:
                    result = json.loads(json_match.group())
                    return result
        except Exception as e:
            logger.error(f"AI extraction error: {e}")
        
        return {"variables": []}

# Initialize services
doc_processor = DocumentProcessor()
ai_service = AIService()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and process document with variable extraction"""
    try:
        # Validate file
        await doc_processor.validate_file(file)
        
        # Extract text
        extracted_text = await doc_processor.extract_text(file)
        
        # Extract variables using AI
        result = await ai_service.extract_variables(extracted_text)
        
        # Save document to database
        db_document = DocumentModel(
            filename=file.filename,
            mime_type=file.content_type,
            raw_text=extracted_text
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        
        # Return result with variables
        return {
            "document_id": db_document.id,
            "filename": db_document.filename,
            "extracted_text": extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text,
            "variables": result.get("variables", [])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
