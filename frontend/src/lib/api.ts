import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Upload API
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Template API
export const saveTemplate = async (templateData: any) => {
  const response = await apiClient.post("/templates/", templateData);
  return response.data;
};

export const getTemplates = async () => {
  const response = await apiClient.get("/templates/");
  return response.data;
};

export const getTemplateById = async (id: string) => {
  const response = await apiClient.get(`/templates/${id}`);
  return response.data;
};

// Chat/Drafting API
export const findMatchingTemplate = async (query: string) => {
  const response = await apiClient.post("/chat/match-template", { query });
  return response.data;
};

export const generateQuestions = async (
  templateId: string,
  existingAnswers: any
) => {
  const response = await apiClient.post("/chat/generate-questions", {
    template_id: templateId,
    answers: existingAnswers,
  });
  return response.data;
};

export const generateDraft = async (templateId: string, answers: any) => {
  const response = await apiClient.post("/drafts/generate", {
    template_id: templateId,
    answers,
  });
  return response.data;
};

// Bonus: Web Search API
export const searchWebTemplates = async (query: string) => {
  const response = await apiClient.post("/chat/web-search", { query });
  return response.data;
};

export default apiClient;
