from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str
    exa_api_key: str = ""
    database_url: str = "sqlite:///./legal_templates.db"
    max_file_size_mb: int = 10
    allowed_file_types: str = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    frontend_url: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"

settings = Settings()
