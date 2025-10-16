import TemplateCard from "./TemplateCard";
import type { Template } from "@/lib/types";

interface TemplateGridProps {
  templates: Template[];
  onSelectTemplate?: (template: Template) => void;
  onViewTemplate?: (id: number) => void;
}

export default function TemplateGrid({
  templates,
  onSelectTemplate,
  onViewTemplate,
}: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 mb-4">No templates found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onSelectTemplate}
          onView={onViewTemplate}
        />
      ))}
    </div>
  );
}
