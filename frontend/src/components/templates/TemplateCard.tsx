import { FileText } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Template } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
  onSelect?: (template: Template) => void;
  onView?: (id: number) => void;
}

export default function TemplateCard({
  template,
  onSelect,
  onView,
}: TemplateCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary-500 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="text-primary-600" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {template.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {template.file_description}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <Badge variant="info" size="sm">
          {template.doc_type}
        </Badge>
        {template.jurisdiction && (
          <Badge variant="neutral" size="sm">
            {template.jurisdiction}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {template.similarity_tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
        {template.similarity_tags && template.similarity_tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
            +{template.similarity_tags.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{template.variables.length} variables</span>
        <span>{new Date(template.created_at).toLocaleDateString()}</span>
      </div>

      <div className="flex gap-2">
        {onView && (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onView(template.id)}
          >
            View Details
          </Button>
        )}
        {onSelect && (
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onSelect(template)}
          >
            Use Template
          </Button>
        )}
      </div>
    </div>
  );
}
