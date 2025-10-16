# Lexi - Legal Document Templating System

A full-stack application that transforms legal documents into reusable templates with smart variable extraction and automated drafting capabilities.

## 🌟 Features

- **Document Ingestion**: Upload and process PDF/DOCX legal documents
- **Smart Template Generation**: Automatically extract variables and create reusable templates
- **AI-Powered Drafting**: Generate documents using natural language queries
- **Variable Management**: Define and manage template variables with validation
- **Web Search Integration**: Find relevant templates online when no local match exists

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **LLM**: Google Gemini 1.5/Flash
- **Database**: PostgreSQL/SQLite
- **Document Processing**: Python-Docx, PyPDF2
- **Vector Search**: FAISS (for template similarity)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: Shadcn UI + Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (or SQLite for development)
- Google AI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lexi.git
   cd lexi
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**
   Create `.env` files in both `backend/` and `frontend/` directories:

   **Backend (.env)**
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/lexi
   GOOGLE_AI_API_KEY=your-google-ai-key
   EXA_API_KEY=your-exa-ai-key  # For bonus feature
   ```

   **Frontend (.env.local)**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Running the Application

1. **Start Backend**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs

## 🏗️ Architecture

### Core Components

1. **Document Ingestor**
   - Handles file uploads (PDF/DOCX)
   - Extracts text and metadata
   - Processes documents into clean text

2. **Template Engine**
   - Identifies and extracts variables using Gemini
   - Creates Markdown templates with YAML front-matter
   - Manages template storage and retrieval

3. **Drafting System**
   - Processes natural language queries
   - Matches queries to templates
   - Handles variable collection and validation
   - Generates final documents

4. **Web Integration (Bonus)**
   - Searches for relevant templates online
   - Processes and ingests new templates on-the-fly
   - Expands template library automatically

## 🧠 Smart Prompting

### Variable Extraction
```python
SYSTEM_PROMPT = """
You are a legal document templating assistant. Extract reusable fields from the provided legal document.
Return a JSON object with variables and their metadata.
"""
```

### Template Matching
```python
TEMPLATE_MATCH_PROMPT = """
Given the user's request and available templates, select the most appropriate template.
Consider the document type, jurisdiction, and content.
Return the template_id and a confidence score.
"""
```

## 📚 Data Model

### Templates
```sql
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    doc_type VARCHAR(100),
    jurisdiction VARCHAR(100),
    similarity_tags TEXT[],
    body_md TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Template Variables
```sql
CREATE TABLE template_variables (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES templates(id),
    key VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    example TEXT,
    required BOOLEAN DEFAULT true,
    dtype VARCHAR(50),
    regex TEXT,
    enum_values TEXT[]
);
```

## 📄 Example Usage

1. **Upload a Document**
   - Go to `/templates/upload`
   - Select a legal document (PDF/DOCX)
   - Review extracted variables
   - Save as a new template

2. **Generate a Draft**
   - Go to `/draft`
   - Enter your request (e.g., "Draft a notice to insurer in India")
   - Answer the variable prompts
   - Download or copy the generated document

## 📝 License

MIT

---

*Created with ❤️ by UOIONHHC*
