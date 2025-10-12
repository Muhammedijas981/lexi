export interface Variable {
  key: string;
  label: string;
  description?: string;
  example?: string;
  required: boolean;
  dtype: string;
  regex_pattern?: string;
  enum_values?: string[];
}

export interface Template {
  id: number;
  template_id: string;
  title: string;
  file_description?: string;
  doc_type: string;
  jurisdiction?: string;
  similarity_tags: string[];
  body_md: string;
  created_at: string;
  variables: Variable[];
}

export interface DocumentUploadResponse {
  document_id: number;
  filename: string;
  extracted_text: string;
  variables: Variable[];
}

export interface DraftResponse {
  draft_md: string;
  template_id: string;
  instance_id: number;
}
