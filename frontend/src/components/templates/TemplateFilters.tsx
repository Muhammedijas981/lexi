"use client";

import { Search, Filter } from "lucide-react";
import Button from "@/components/ui/Button";

interface TemplateFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick?: () => void;
}

export default function TemplateFilters({
  searchQuery,
  onSearchChange,
  onFilterClick,
}: TemplateFiltersProps) {
  return (
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
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        {onFilterClick && (
          <Button variant="secondary" onClick={onFilterClick}>
            <Filter size={18} className="mr-2" />
            Filters
          </Button>
        )}
      </div>
    </div>
  );
}
