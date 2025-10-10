// Core TypeScript interfaces
export interface Template {
  id: string;
  template_id: string;
  title: string;
  description: string;
  doc_type: string;
  jurisdiction: string;
  similarity_tags: string[];
  body_md: string;
  created_at: string;
  variables?: TemplateVariable[];
}

export interface TemplateVariable {
  id: string;
  template_id: string;
  key: string;
  label: string;
  description: string;
  example: string;
  required: boolean;
  dtype: "string" | "number" | "date" | "email" | "phone";
  regex?: string;
  enum?: string[];
}

export interface Document {
  id: string;
  filename: string;
  mime_type: string;
  raw_text: string;
  created_at: string;
}

export interface DraftInstance {
  id: string;
  template_id: string;
  user_query: string;
  answers_json: Record<string, any>;
  draft_md: string;
  created_at: string;
}

export interface TemplateMatch {
  template: Template;
  confidence_score: number;
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: any;
}
