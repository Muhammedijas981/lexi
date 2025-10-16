"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { FileText, Download, Eye } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Draft History</h1>
        <p className="text-gray-600 mt-2">
          View and manage your previously generated documents
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FileText className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Draft History Yet
        </h3>
        <p className="text-gray-600">
          Start drafting documents to see your history here
        </p>
      </div>
    </div>
  );
}
