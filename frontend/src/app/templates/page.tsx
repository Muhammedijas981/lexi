"use client";

import { Search, Filter } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const mockTemplates = [
  {
    id: "1",
    title: "Incident Notice to Insurer",
    doc_type: "Legal Notice",
    jurisdiction: "India",
    variables: 7,
    tags: ["insurance", "notice", "motor"],
    created_at: "2025-10-08",
  },
  {
    id: "2",
    title: "Rental Agreement",
    doc_type: "Contract",
    jurisdiction: "India",
    variables: 12,
    tags: ["rental", "property", "mumbai"],
    created_at: "2025-10-07",
  },
];

export default function TemplatesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Templates Library</h1>
        <p className="text-gray-600 mt-2">
          Browse and manage your legal document templates
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button variant="secondary">
            <Filter size={18} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <Card key={template.id} variant="interactive" className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.title}
              </h3>
              <div className="flex gap-2 mb-3">
                <Badge variant="info" size="sm">
                  {template.doc_type}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {template.jurisdiction}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{template.variables} variables</span>
              <span>{new Date(template.created_at).toLocaleDateString()}</span>
            </div>

            <Button variant="primary" className="w-full">
              Use Template
            </Button>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockTemplates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No templates found</p>
        </div>
      )}
    </div>
  );
}
