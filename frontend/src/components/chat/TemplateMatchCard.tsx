import { FileText, Check } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Template } from "@/lib/types";

interface TemplateMatchCardProps {
  template: Template;
  confidence: number;
  reasoning: string;
  onSelect: () => void;
}

export default function TemplateMatchCard({
  template,
  confidence,
  reasoning,
  onSelect,
}: TemplateMatchCardProps) {
  return (
    <div className="bg-white border border-primary-200 rounded-lg p-6 shadow-md">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="text-primary-600" size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {template.title}
            </h3>
            <Badge variant="success" size="sm">
              {Math.round(confidence * 100)}% Match
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{template.file_description}</p>
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Why this template?</strong> {reasoning}
        </p>
      </div>

      <div className="flex gap-2 mb-3">
        <Badge variant="info" size="sm">
          {template.doc_type}
        </Badge>
        <Badge variant="neutral" size="sm">
          {template.jurisdiction}
        </Badge>
        <Badge variant="neutral" size="sm">
          {template.variables.length} variables
        </Badge>
      </div>

      <Button variant="primary" className="w-full" onClick={onSelect}>
        <Check size={18} className="mr-2" />
        Use This Template
      </Button>
    </div>
  );
}
