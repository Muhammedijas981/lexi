import google.generativeai as genai
from config import settings
import json
import re
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import models
from schemas import VariableCreate, TemplateMetadataBase, Question
import logging

logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# Generation config for consistent results
generation_config = genai.types.GenerationConfig(
    temperature=0.1,
    top_p=0.8,
    top_k=40,
    max_output_tokens=4096,
)

async def extract_variables(text: str, existing_variables: Optional[List[VariableCreate]] = None) -> Dict[str, Any]:
    """
    Extract variables from legal document text using Gemini.
    
    Args:
        text: Document text to analyze
        existing_variables: Existing variables to avoid duplication (for chunking)
    
    Returns:
        Dict with 'variables', 'similarity_tags', 'title', 'doc_type'
    """
    
    # Build context for existing variables if chunking
    existing_context = ""
    if existing_variables:
        existing_keys = [v.key for v in existing_variables]
        existing_context = f"\n\nIMPORTANT: These variables already exist, reuse them if applicable:\n{json.dumps(existing_keys, indent=2)}\n"
    
    prompt = f"""You are a legal document templating assistant. Analyze this legal document and identify ALL reusable fields that should become variables.

CRITICAL RULES:
1. Return ONLY valid JSON, no explanations
2. Use snake_case for all keys (e.g., landlord_name, monthly_rent, incident_date)
3. Identify ALL of these types:
   - Party names (landlord, tenant, claimant, insured, employer, employee)
   - Dates (agreement_date, incident_date, start_date, end_date, lease_period)
   - Amounts (monthly_rent, security_deposit, claim_amount, salary)
   - Addresses (property_address, landlord_address, tenant_address)
   - IDs/Numbers (policy_number, registration_number, case_number, account_number)
   - Contact info (phone_number, email_address)
   - Property details (property_type, lease_duration, notice_period)
4. DO NOT variabilize: legal statute references, mandatory legal text, headers
5. Deduplicate identical fields (e.g., "tenant name" and "name of tenant" = one variable)
6. For each variable provide: key, label, description, example (extract from document), required flag{existing_context}

Document text:
{text[:4000]}

Return JSON in this EXACT format:
{{
  "variables": [
    {{
      "key": "landlord_name",
      "label": "Landlord's Full Name",
      "description": "Full legal name of the property owner/landlord",
      "example": "Priya Sharma",
      "required": true,
      "dtype": "string"
    }},
    {{
      "key": "monthly_rent",
      "label": "Monthly Rent Amount",
      "description": "Monthly rental amount in INR",
      "example": "25000",
      "required": true,
      "dtype": "number"
    }}
  ],
  "title": "Rental Agreement",
  "doc_type": "rental_agreement",
  "jurisdiction": "IN",
  "similarity_tags": ["rental", "agreement", "lease", "property"]
}}"""

    try:
        response = model.generate_content(
            prompt,
            generation_config=generation_config
        )
        
        if not response or not hasattr(response, 'text'):
            raise Exception("AI response was blocked or empty")
        
        response_text = response.text.strip()
        
        # Extract JSON from response (handle markdown code blocks)
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            result = json.loads(json_match.group())
            
            # Validate and sanitize variables
            sanitized_variables = []
            for var_data in result.get("variables", []):
                try:
                    # Ensure all required fields exist
                    if not var_data.get("key") or not var_data.get("label"):
                        continue
                    
                    # Sanitize data
                    sanitized = {
                        "key": str(var_data["key"]).strip(),
                        "label": str(var_data.get("label", var_data["key"])).strip(),
                        "description": str(var_data.get("description", "")).strip(),
                        "example": str(var_data.get("example", "")).strip(),
                        "required": bool(var_data.get("required", False)),
                        "dtype": str(var_data.get("dtype", "string")).strip()
                    }
                    
                    sanitized_variables.append(sanitized)
                except Exception as e:
                    logger.warning(f"Skipping invalid variable: {var_data}. Error: {e}")
                    continue
            
            return {
                "variables": sanitized_variables,
                "title": result.get("title", "Untitled Template"),
                "doc_type": result.get("doc_type", "document"),
                "jurisdiction": result.get("jurisdiction"),
                "similarity_tags": result.get("similarity_tags", ["legal", "template"])
            }
        
        raise Exception("No valid JSON found in AI response")
        
    except Exception as e:
        logger.error(f"Error extracting variables: {e}")
        # Minimal fallback
        return {
            "variables": [],
            "title": "Document Template",
            "doc_type": "document",
            "jurisdiction": None,
            "similarity_tags": ["legal"]
        }


async def match_template(query: str, db: Session) -> Optional[Dict[str, Any]]:
    """
    Find the best matching template for user query using Gemini.
    
    Args:
        query: User's drafting request
        db: Database session
    
    Returns:
        Dict with 'template', 'confidence_score', 'reasoning' or None
    """
    
    # Get all templates
    templates = db.query(models.Template).all()
    
    if not templates:
        return None
    
    # Build template context
    template_context = []
    for t in templates:
        template_context.append({
            "id": t.id,
            "title": t.title,
            "description": t.file_description,
            "doc_type": t.doc_type,
            "jurisdiction": t.jurisdiction,
            "tags": t.similarity_tags
        })
    
    prompt = f"""You are a legal document classification assistant. Find the best matching template for the user's request.

User request: "{query}"

Available templates:
{json.dumps(template_context, indent=2)}

TASK:
1. Analyze the user's intent (document type, jurisdiction, purpose)
2. Match against templates based on: title, doc_type, jurisdiction, tags, description
3. Return confidence score (0.0 to 1.0). If confidence < 0.6, return "none"
4. Provide brief reasoning

Return ONLY valid JSON:
{{
  "template_id": 1,
  "confidence": 0.92,
  "reasoning": "User needs rental agreement for property lease. Template matches doc_type and contains relevant tags."
}}

OR if no good match:
{{
  "template_id": "none",
  "confidence": 0.0,
  "reasoning": "No template adequately matches the request."
}}"""

    try:
        response = model.generate_content(prompt, generation_config=generation_config)
        
        if not response or not response.text:
            return None
        
        json_match = re.search(r'\{[\s\S]*\}', response.text)
        if json_match:
            result = json.loads(json_match.group())
            
            if result.get("template_id") == "none" or result.get("confidence", 0) < 0.6:
                return None
            
            # Get the template
            template = db.query(models.Template).filter(
                models.Template.id == result["template_id"]
            ).first()
            
            if template:
                return {
                    "template": template,
                    "confidence_score": result.get("confidence", 0.0),
                    "reasoning": result.get("reasoning", "")
                }
        
        return None
        
    except Exception as e:
        logger.error(f"Error matching template: {e}")
        return None


async def generate_questions(template_id: int, existing_answers: Dict[str, Any], db: Session) -> List[Dict[str, Any]]:
    """
    Generate human-friendly questions for missing template variables.
    
    Args:
        template_id: Template ID
        existing_answers: Already filled answers
        db: Database session
    
    Returns:
        List of question dicts
    """
    
    # Get template variables
    template = db.query(models.Template).filter(models.Template.id == template_id).first()
    
    if not template:
        return []
    
    questions = []
    for variable in template.variables:
        # Skip if already answered
        if variable.key in existing_answers:
            continue
        
        # Generate human-friendly question
        prompt = f"""Transform this variable into a clear, polite question for a legal document form.

Variable:
- Key: {variable.key}
- Label: {variable.label}
- Description: {variable.description}
- Example: {variable.example}
- Type: {variable.dtype}
- Required: {variable.required}

Rules:
1. Ask clearly and professionally
2. Include format hints for dates/numbers
3. Be specific and unambiguous
4. Don't use the technical variable name

BAD: "policy_number?"
GOOD: "What is your insurance policy number exactly as it appears on your policy schedule?"

Return ONLY the question text, nothing else."""

        try:
            response = model.generate_content(prompt, generation_config=generation_config)
            question_text = response.text.strip().strip('"\'')
            
            questions.append({
                "key": variable.key,
                "question": question_text,
                "label": variable.label,
                "example": variable.example,
                "required": variable.required,
                "dtype": variable.dtype,
                "enum_values": variable.enum_values
            })
        except Exception as e:
            # Fallback question
            questions.append({
                "key": variable.key,
                "question": f"Please provide {variable.label.lower()}",
                "label": variable.label,
                "example": variable.example,
                "required": variable.required,
                "dtype": variable.dtype,
                "enum_values": variable.enum_values
            })
    
    return questions
