"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import type { Variable } from "@/lib/types";

interface QuestionInputProps {
  variable: Variable;
  value: string;
  onChange: (key: string, value: string) => void;
}

export default function QuestionInput({
  variable,
  value,
  onChange,
}: QuestionInputProps) {
  const [error, setError] = useState("");

  const handleChange = (newValue: string) => {
    onChange(variable.key, newValue);

    // Basic validation
    if (variable.required && !newValue.trim()) {
      setError("This field is required");
    } else if (variable.regex_pattern && newValue) {
      const regex = new RegExp(variable.regex_pattern);
      if (!regex.test(newValue)) {
        setError("Invalid format");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  if (variable.enum_values && variable.enum_values.length > 0) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {variable.label}
          {variable.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select an option...</option>
          {variable.enum_values.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {variable.description && (
          <p className="text-xs text-gray-500 mt-1">{variable.description}</p>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <Input
      label={variable.label}
      type={
        variable.dtype === "number"
          ? "number"
          : variable.dtype === "date"
          ? "date"
          : "text"
      }
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={variable.example}
      required={variable.required}
      error={error}
      helperText={variable.description}
    />
  );
}
