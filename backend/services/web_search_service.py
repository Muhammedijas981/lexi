from exa_py import Exa
from config import settings
import re

# Initialize Exa client (only if API key is provided)
exa_client = None
if settings.exa_api_key:
    exa_client = Exa(api_key=settings.exa_api_key)

async def search_web_for_templates(query: str, num_results: int = 5) -> list:
    """
    Use Exa.ai to search the web for similar legal documents
    Returns list of documents with content
    """
    
    if not exa_client:
        return []
    
    try:
        # Enhance query for legal document search
        search_query = f"legal template {query} format example"
        
        # Search with Exa
        results = exa_client.search_and_contents(
            search_query,
            type="neural",
            num_results=num_results,
            text=True
        )
        
        documents = []
        for result in results.results:
            documents.append({
                "title": result.title,
                "url": result.url,
                "text": result.text[:2000],  # Limit text length
                "published_date": result.published_date if hasattr(result, 'published_date') else None
            })
        
        return documents
    except Exception as e:
        print(f"Error searching web: {e}")
        return []

def clean_web_content(html_text: str) -> str:
    """
    Clean fetched web content to extract only the legal document text
    Remove navigation, ads, headers, footers, etc.
    """
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', html_text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Remove common web noise
    noise_patterns = [
        r'Cookie Policy.*?(?=\n|$)',
        r'Privacy Policy.*?(?=\n|$)',
        r'Terms of Service.*?(?=\n|$)',
        r'Subscribe.*?(?=\n|$)',
        r'Sign up.*?(?=\n|$)',
    ]
    
    for pattern in noise_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    
    return text
