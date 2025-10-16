"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { getTemplateById } from "@/lib/api";
import type { Template } from "@/lib/types";

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplate();
  }, [params.id]);

  const loadTemplate = async () => {
    try {
      const data = await getTemplateById(Number(params.id));
      setTemplate(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load template");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">Loading...</div>
    );
  }

  if (!template) {
    return <div className="text-center py-12">Template not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/templates"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Templates
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {template.title}
            </h1>
            <p className="text-gray-600 mt-2">{template.file_description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => router.push("/chat")}>
              Use Template
            </Button>
            <Button variant="ghost">
              <Edit size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Template Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Template ID</p>
            <p className="font-mono text-sm">{template.template_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Document Type</p>
            <Badge variant="info">{template.doc_type}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Jurisdiction</p>
            <Badge variant="neutral">
              {template.jurisdiction || "Not specified"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm">
              {new Date(template.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {template.similarity_tags?.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Variables */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Variables ({template.variables.length})
        </h2>
        <div className="space-y-3">
          {template.variables.map((variable) => (
            <div
              key={variable.key}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-primary-600">
                      {variable.key}
                    </code>
                    {variable.required && (
                      <Badge variant="error" size="sm">
                        Required
                      </Badge>
                    )}
                    <Badge variant="neutral" size="sm">
                      {variable.dtype}
                    </Badge>
                  </div>
                  <p className="font-medium text-gray-900">{variable.label}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {variable.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Example:{" "}
                    <span className="font-medium">{variable.example}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Body Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Template Body</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(template.body_md)}
          >
            <Copy size={16} className="mr-2" />
            Copy
          </Button>
        </div>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
          {template.body_md}
        </pre>
      </div>
    </div>
  );
}
