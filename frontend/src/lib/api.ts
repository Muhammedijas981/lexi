import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// DOCUMENT UPLOAD API
// =====================

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(
      error.response?.data?.detail || "Failed to upload document"
    );
  }
};

// =====================
// TEMPLATE API
// =====================

export const saveTemplate = async (templateData: any) => {
  try {
    const response = await apiClient.post("/templates/", templateData);
    return response.data;
  } catch (error: any) {
    console.error("Save template error:", error);
    throw new Error(error.response?.data?.detail || "Failed to save template");
  }
};

export const getTemplates = async () => {
  try {
    const response = await apiClient.get("/templates/");
    return response.data;
  } catch (error: any) {
    console.error("Get templates error:", error);
    throw new Error(
      error.response?.data?.detail || "Failed to fetch templates"
    );
  }
};

export const getTemplateById = async (id: number) => {
  try {
    const response = await apiClient.get(`/templates/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get template error:", error);
    throw new Error(error.response?.data?.detail || "Failed to fetch template");
  }
};

// =====================
// CHAT/DRAFTING API
// =====================

export const findMatchingTemplate = async (query: string) => {
  try {
    const response = await apiClient.post("/chat/match-template", { query });
    return response.data;
  } catch (error: any) {
    console.error("Match template error:", error);
    return null; // Return null if no match
  }
};

export const generateQuestions = async (
  templateId: number,
  existingAnswers: any = {}
) => {
  try {
    const response = await apiClient.post("/chat/generate-questions", null, {
      params: {
        template_id: templateId,
        answers: existingAnswers,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Generate questions error:", error);
    throw new Error(
      error.response?.data?.detail || "Failed to generate questions"
    );
  }
};

export const generateDraft = async (templateId: number, answers: any) => {
  try {
    const response = await apiClient.post("/drafts/generate", {
      template_id: templateId,
      answers,
    });
    return response.data;
  } catch (error: any) {
    console.error("Generate draft error:", error);
    throw new Error(error.response?.data?.detail || "Failed to generate draft");
  }
};

// =====================
// HEALTH CHECK
// =====================

export const healthCheck = async () => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    return { status: "unhealthy" };
  }
};

export default apiClient;
