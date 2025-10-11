import re
from datetime import datetime

def generate_draft(template_body: str, answers: dict) -> str:
    """
    Replace all {{variable}} placeholders with actual values
    Strict replacement - no AI rewriting
    """
    
    draft = template_body
    
    # Replace all {{variable}} with values from answers
    for key, value in answers.items():
        # Handle different data types
        if isinstance(value, dict) and 'value' in value:
            value = value['value']
        
        # Format based on type
        if isinstance(value, datetime):
            value = value.strftime('%Y-%m-%d')
        elif value is None:
            value = f"[MISSING: {key}]"
        else:
            value = str(value)
        
        # Replace with case-insensitive matching
        pattern = r'\{\{\s*' + re.escape(key) + r'\s*\}\}'
        draft = re.sub(pattern, value, draft, flags=re.IGNORECASE)
    
    return draft

def create_template_from_text(text: str, variables: list) -> str:
    """
    Convert plain text document into template with {{variable}} syntax
    Replaces detected variable values with placeholder syntax
    """
    
    template = text
    
    for variable in variables:
        # If we have an example value, try to replace it
        if variable.get('example'):
            # Replace exact matches and similar patterns
            template = template.replace(variable['example'], f"{{{{{variable['key']}}}}}")
    
    return template

def validate_answers(variables: list, answers: dict) -> dict:
    """
    Validate user answers against variable constraints
    Returns dict with errors for invalid values
    """
    
    errors = {}
    
    for variable in variables:
        key = variable.get('key')
        value = answers.get(key)
        
        # Check required fields
        if variable.get('required', False) and not value:
            errors[key] = f"{variable.get('label')} is required"
            continue
        
        if not value:
            continue
        
        # Validate data type
        dtype = variable.get('dtype', 'string')
        
        if dtype == 'date':
            # Validate ISO date format
            if not re.match(r'^\d{4}-\d{2}-\d{2}$', str(value)):
                errors[key] = "Date must be in YYYY-MM-DD format"
        
        elif dtype == 'number':
            try:
                float(value)
            except ValueError:
                errors[key] = "Must be a valid number"
        
        elif dtype == 'email':
            if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', str(value)):
                errors[key] = "Must be a valid email address"
        
        # Validate regex if provided
        if variable.get('regex'):
            if not re.match(variable['regex'], str(value)):
                errors[key] = f"Must match pattern: {variable['regex']}"
        
        # Validate enum if provided
        if variable.get('enum'):
            if value not in variable['enum']:
                errors[key] = f"Must be one of: {', '.join(variable['enum'])}"
    
    return errors

def generate_template_id(title: str) -> str:
    """
    Generate a template_id from title
    e.g., "Incident Notice to Insurer" -> "tpl_incident_notice_v1"
    """
    
    # Convert to lowercase and replace spaces with underscores
    clean_title = re.sub(r'[^\w\s]', '', title.lower())
    clean_title = re.sub(r'\s+', '_', clean_title)
    
    # Add prefix and version
    return f"tpl_{clean_title}_v1"
