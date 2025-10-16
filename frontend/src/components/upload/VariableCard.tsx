"use client";

import { useState } from "react";
import { Trash2, Edit2 } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface Variable {
  key: string;
  label: string;
  description: string;
  example: string;
  required: boolean;
  dtype: string;
}

interface VariableCardProps {
  variable: Variable;
  onDelete: (key: string) => void;
  onUpdate: (key: string, updated: Partial<Variable>) => void;
}

export default function VariableCard({
  variable,
  onDelete,
  onUpdate,
}: VariableCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors bg-white">
      <div className="flex items-start justify-between mb-2">
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
          </div>
          <p className="font-medium text-gray-900">{variable.label}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit2 size={14} className="text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(variable.key)}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">{variable.description}</p>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Example:</span>
        <span className="font-medium text-gray-700">{variable.example}</span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={variable.required}
            onChange={(e) =>
              onUpdate(variable.key, { required: e.target.checked })
            }
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-gray-700">Required field</span>
        </label>
      </div>
    </div>
  );
}
