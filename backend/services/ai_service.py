import google.generativeai as genai
from config import settings
import json
import re
from sqlalchemy.orm import Session
import models

# Configure Gemini
genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

async def extract_variables(text: str, existing_variables: list = None) -> list:
    """
    Extract variables from legal document text using Gemini
    Pro tip: For long documents, pass existing_variables from previous chunks
    to maintain consistency and avoid duplicates
    """
    
    existing_vars_context = ""
    if existing_variables:
        existing_vars_context = f"\n\nPreviously discovered variables (reuse these keys if applicable):\n{json.dumps([v['key'] for v in existing_variables], indent=2)}"
    
    prompt = f"""You are a legal document templating assistant. Analyze this legal document and identify reusable fields that should become variables.

CRITICAL RULES:
1. Return ONLY valid JSON, no explanations or markdown
2. Use snake_case for all variable keys (e.g., claimant_full_name, incident_date)
3. Identify: parties, dates, amounts, addresses, policy numbers, case numbers, forums, signatures
4. DO NOT variabilize statutory references, legal citations, or mandatory legal text
5. Deduplicate logically identical fields (e.g., "claimant name" and "name of claimant" should be ONE variable)
6. Favor domain-generic names over document-specific names{existing_vars_context}

Document text:
{text[:3000]}

Return JSON in this EXACT format:
{{
  "variables": [
    {{
      "key": "claimant_full_name",
      "label": "Claimant's Full Name",
      "description": "Person or entity raising the claim",
      "example": "Rajesh Kumar",
      "required": true,
      "dtype": "string"
    }}
  ],
  "similarity_tags": ["insurance", "notice", "india"]
}}"""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Extract JSON from response (handle markdown code blocks)
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            result = json.loads(json_match.group())
            return result.get("variables", [])
        
        return []
    except Exception as e:
        print(f"Error extracting variables: {e}")
        # Fallback: return basic variables
        return [
            {
                "key": "party_name",
                "label": "Party Name",
                "description": "Name of the party",
                "example": "John Doe",
                "required": True,
                "dtype": "string"
            }
        ]

async def match_template(query: str, db: Session):
    """
    Find the best matching template for user query using Gemini
    Uses classification + confidence scoring
    """
    
    # Get all templates
    templates = db.query(models.Template).all()
    
    if not templates:
        return None
    
    # Build template context
    template_context = []
    for t in templates:
        template_context.append({
            "template_id": t.template_id,
            "title": t.title,
            "description": t.description,
            "doc_type": t.doc_type,
            "jurisdiction": t.jurisdiction,
            "tags": t.similarity_tags
        })
    
    prompt = f"""You are a legal document classification assistant. Given a user request, select the best matching template.

User request: "{query}"

Available templates:
{json.dumps(template_context, indent=2)}

TASK:
1. Analyze the user's intent (document type, jurisdiction, subject matter)
2. Match against available templates based on: doc_type, jurisdiction, tags, description
3. Return confidence score (0.0 to 1.0). If confidence < 0.6, return "none"
4. Provide brief reasoning

Return ONLY valid JSON in this format:
{{
  "template_id": "tpl_incident_notice_v1",
  "confidence": 0.92,
  "reasoning": "User needs insurance notice for India. Template matches doc_type, jurisdiction, and insurance tags."
}}

OR if no good match:
{{
  "template_id": "none",
  "confidence": 0.0,
  "reasoning": "No template matches the request adequately."
}}"""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Extract JSON
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            result = json.loads(json_match.group())
            
            if result.get("template_id") == "none" or result.get("confidence", 0) < 0.6:
                return None
            
            # Get the template
            template = db.query(models.Template).filter(
                models.Template.template_id == result["template_id"]
            ).first()
            
            if template:
                return {
                    "template": template,
                    "confidence_score": result.get("confidence", 0.0),
                    "reasoning": result.get("reasoning", "")
                }
        
        return None
    except Exception as e:
        print(f"Error matching template: {e}")
        return None

async def generate_questions(template_id: str, existing_answers: dict, db: Session) -> list:
    """
    Generate human-friendly questions for missing template variables
    Transforms technical variable names into clear, polite questions
    """
    
    # Get template variables
    template = db.query(models.Template).filter(
        models.Template.template_id == template_id
    ).first()
    
    if not template:
        return []
    
    questions = []
    for variable in template.variables:
        # Skip if already answered
        if variable.key in existing_answers:
            continue
        
        # Generate human-friendly question
        prompt = f"""Transform this variable into a clear, polite question for a user filling out a legal document.

Variable details:
- Key: {variable.key}
- Label: {variable.label}
- Description: {variable.description}
- Example: {variable.example}
- Required: {variable.required}
- Type: {variable.dtype}

Rules:
1. Ask clearly and professionally
2. Include format hints (e.g., "in DD/MM/YYYY format")
3. Be specific and unambiguous
4. Don't use the technical variable name

BAD: "policy_number?"
GOOD: "What is the insurance policy number exactly as it appears on your policy schedule?"

Return ONLY the question text, nothing else."""

        try:
            response = model.generate_content(prompt)
            question_text = response.text.strip().strip('"')
            
            questions.append({
                "key": variable.key,
                "question": question_text,
                "example": variable.example,
                "required": variable.required,
                "dtype": variable.dtype
            })
        except Exception as e:
            # Fallback to basic question
            questions.append({
                "key": variable.key,
                "question": f"Please provide {variable.label.lower()}",
                "example": variable.example,
                "required": variable.required,
                "dtype": variable.dtype
            })
    
    return questions

async def prefill_variables_from_query(query: str, variables: list) -> dict:
    """
    Use Gemini to extract variable values from the user's original query
    This pre-fills what we can infer before asking questions
    """
    
    variable_keys = [v["key"] for v in variables]
    
    prompt = f"""Extract any information from the user query that matches these variables.

User query: "{query}"

Variables to extract:
{json.dumps(variables, indent=2)}

Return JSON with extracted values (use null for unknown):
{{
  "claimant_full_name": "extracted value or null",
  "incident_date": "2025-10-10 or null",
  ...
}}

Return ONLY the JSON object."""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            result = json.loads(json_match.group())
            # Filter out null values
            return {k: v for k, v in result.items() if v is not None}
        
        return {}
    except Exception as e:
        print(f"Error prefilling variables: {e}")
        return {}
