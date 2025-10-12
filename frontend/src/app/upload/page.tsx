"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FileDropzone from "@/components/upload/FileDropzone";
import VariableCard from "@/components/upload/VariableCard";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { uploadDocument, saveTemplate } from "@/lib/api";
import type { Variable } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const result = await uploadDocument(selectedFile);

      setDocumentId(result.document_id);
      setExtractedText(result.extracted_text);
      setVariables(result.variables || []);
      setIsProcessing(false);

      if (result.variables && result.variables.length > 0) {
        setToastMessage(
          `Extracted ${result.variables.length} variables successfully!`
        );
        setToastType("success");
      } else {
        setToastMessage(
          "Document processed but no variables extracted. You can add them manually."
        );
        setToastType("warning");
      }
      setShowToast(true);
    } catch (error: any) {
      setIsProcessing(false);
      setToastMessage(error.message || "Failed to process document");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleDeleteVariable = (key: string) => {
    setVariables(variables.filter((v) => v.key !== key));
  };

  const handleUpdateVariable = (key: string, updated: Partial<Variable>) => {
    setVariables(
      variables.map((v) => (v.key === key ? { ...v, ...updated } : v))
    );
  };

  const generateTemplateBody = () => {
    // Create template body with variables
    return variables.map((v) => `{{${v.key}}}`).join("\n\n");
  };

  const handleSaveTemplate = async () => {
    if (!file || variables.length === 0) {
      setToastMessage("Please ensure document has variables before saving");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setIsProcessing(true);

    try {
      const templateId = `tpl_${file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")}_v1`;

      const templateData = {
        template_id: templateId,
        title: file.name.replace(/\.[^/.]+$/, ""),
        file_description: `Template generated from ${file.name}`,
        doc_type: "document",
        jurisdiction: "IN",
        similarity_tags: ["auto-generated"],
        body_md: extractedText.substring(0, 1000), // Use extracted text
        variables: variables.map((v) => ({
          key: v.key,
          label: v.label,
          description: v.description || "",
          example: v.example || "",
          required: v.required,
          dtype: v.dtype,
          regex_pattern: v.regex_pattern || null,
          enum_values: v.enum_values || null,
        })),
      };

      await saveTemplate(templateData);

      setIsProcessing(false);
      setToastMessage(`Template "${templateId}" saved successfully!`);
      setToastType("success");
      setShowToast(true);

      setTimeout(() => {
        router.push("/templates");
      }, 2000);
    } catch (error: any) {
      setIsProcessing(false);
      setToastMessage(error.message || "Failed to save template");
      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Upload Legal Document
        </h1>
        <p className="text-gray-600 mt-2">
          Upload a legal document to convert it into a reusable template with
          AI-extracted variables
        </p>
      </div>

      {/* Upload Section */}
      {!file && (
        <div className="bg-white rounded-lg shadow p-8">
          <FileDropzone onFileSelect={handleFileSelect} />
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Loader2
            className="mx-auto mb-4 animate-spin text-primary-500"
            size={48}
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Processing Document...
          </h3>
          <p className="text-gray-600">
            Extracting variables and analyzing document structure with AI
          </p>
        </div>
      )}

      {/* Variables Review */}
      {file && !isProcessing && (
        <div className="space-y-6">
          {variables.length > 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Detected Variables ({variables.length})
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {variables.map((variable) => (
                  <VariableCard
                    key={variable.key}
                    variable={variable}
                    onDelete={handleDeleteVariable}
                    onUpdate={handleUpdateVariable}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                No Variables Detected
              </h3>
              <p className="text-yellow-700">
                The AI couldn't extract variables from this document. You can
                still create a template manually.
              </p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
            <Button
              variant="ghost"
              onClick={() => {
                setFile(null);
                setVariables([]);
                setDocumentId(null);
              }}
            >
              Discard
            </Button>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleSaveTemplate}
                loading={isProcessing}
                disabled={variables.length === 0}
              >
                Save as Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType as any}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
