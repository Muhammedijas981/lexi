"use client";

import { useState, useEffect } from "react";
import { Send, Sparkles, FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import { getTemplates, generateDraft } from "@/lib/api";
import type { Template } from "@/lib/types";

export default function ChatPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to load templates");
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setAnswers({});
    setDraft("");
  };

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handleGenerateDraft = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      const result = await generateDraft(selectedTemplate.id, answers);
      setDraft(result.draft_md);
    } catch (error: any) {
      alert(error.message);
    }
    setIsGenerating(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Legal Document Drafter
        </h1>
        <p className="text-gray-600 mt-2">
          Select a template and fill in the details to generate your document
        </p>
      </div>

      {!selectedTemplate ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Select a Template</h2>
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md cursor-pointer transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {template.file_description}
                  </p>
                  <div className="flex gap-2">
                    {template.similarity_tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No templates available. Upload a document first.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Fill Template Variables
            </h2>
            <div className="space-y-4">
              {selectedTemplate.variables.map((variable) => (
                <div key={variable.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {variable.label}
                    {variable.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type={variable.dtype === "number" ? "number" : "text"}
                    placeholder={variable.example}
                    value={answers[variable.key] || ""}
                    onChange={(e) =>
                      handleAnswerChange(variable.key, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {variable.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {variable.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                Back to Templates
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerateDraft}
                loading={isGenerating}
              >
                Generate Draft
              </Button>
            </div>
          </div>

          {draft && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Generated Draft</h2>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap font-serif">
                {draft}
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigator.clipboard.writeText(draft)}
                >
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
