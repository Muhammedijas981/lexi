"use client";

import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import FileDropzone from "@/components/upload/FileDropzone";
import VariableCard from "@/components/upload/VariableCard";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

interface Variable {
  key: string;
  label: string;
  description: string;
  example: string;
  required: boolean;
  dtype: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);

    // Simulate API call for variable extraction
    setTimeout(() => {
      // Mock variables - replace with actual API call
      setVariables([
        {
          key: "claimant_full_name",
          label: "Claimant's Full Name",
          description: "Person/entity raising the claim",
          example: "Rajesh Kumar",
          required: true,
          dtype: "string",
        },
        {
          key: "incident_date",
          label: "Date of Incident",
          description: "The date the insured event occurred (ISO 8601)",
          example: "2025-07-12",
          required: true,
          dtype: "date",
        },
        {
          key: "policy_number",
          label: "Policy Number",
          description: "Insurance policy reference as printed on schedule",
          example: "302786965",
          required: true,
          dtype: "string",
        },
      ]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleDeleteVariable = (key: string) => {
    setVariables(variables.filter((v) => v.key !== key));
  };

  const handleUpdateVariable = (key: string, updated: Partial<Variable>) => {
    setVariables(
      variables.map((v) => (v.key === key ? { ...v, ...updated } : v))
    );
  };

  const handleSaveTemplate = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Template saved successfully!");
      setToastType("success");
      setShowToast(true);
    }, 1000);
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
          variables
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
            Extracting variables and analyzing document structure
          </p>
        </div>
      )}

      {/* Variables Review */}
      {file && !isProcessing && variables.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Detected Variables ({variables.length})
              </h2>
              <Button variant="ghost" size="sm">
                Add Variable
              </Button>
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

          {/* Action Bar */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
            <Button
              variant="ghost"
              onClick={() => {
                setFile(null);
                setVariables([]);
              }}
            >
              Discard
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary">Preview Template</Button>
              <Button variant="primary" onClick={handleSaveTemplate}>
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
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
