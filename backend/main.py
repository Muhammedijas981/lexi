from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
from routers import documents, templates, chat, drafts

# Initialize database
init_db()

app = FastAPI(
    title="LexiDraft API",
    description="Legal Document Templating System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router, prefix="/documents", tags=["documents"])
app.include_router(templates.router, prefix="/templates", tags=["templates"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(drafts.router, prefix="/drafts", tags=["drafts"])

@app.get("/")
def root():
    return {
        "message": "LexiDraft API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
