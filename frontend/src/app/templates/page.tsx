"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import TemplateGrid from "@/components/templates/TemplateGrid";
import TemplateFilters from "@/components/templates/TemplateFilters";
import { getTemplates } from "@/lib/api";
import type { Template } from "@/lib/types";

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, templates]);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
      setFilteredTemplates(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    if (!searchQuery.trim()) {
      setFilteredTemplates(templates);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = templates.filter(
      (template) =>
        template.title.toLowerCase().includes(query) ||
        template.doc_type.toLowerCase().includes(query) ||
        template.similarity_tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        )
    );
    setFilteredTemplates(filtered);
  };

  const handleViewTemplate = (id: number) => {
    router.push(`/templates/${id}`);
  };

  const handleSelectTemplate = (template: Template) => {
    router.push("/chat");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Templates Library</h1>
        <p className="text-gray-600 mt-2">
          Browse and manage your legal document templates (
          {filteredTemplates.length} templates)
        </p>
      </div>

      {/* Filters */}
      <TemplateFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Templates Grid */}
      {error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={loadTemplates}>
            Retry
          </Button>
        </div>
      ) : filteredTemplates.length === 0 && templates.length > 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No templates match your search</p>
        </div>
      ) : (
        <TemplateGrid
          templates={filteredTemplates}
          onSelectTemplate={handleSelectTemplate}
          onViewTemplate={handleViewTemplate}
        />
      )}

      {templates.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">
            No templates yet. Upload your first document!
          </p>
          <Button onClick={() => router.push("/upload")}>
            Upload Template
          </Button>
        </div>
      )}
    </div>
  );
}
