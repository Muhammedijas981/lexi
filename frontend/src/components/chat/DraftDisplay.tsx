"use client";

import { useState } from "react";
import { Copy, Download, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { downloadFile } from "@/lib/utils";

interface DraftDisplayProps {
  draft: string;
  templateTitle?: string;
}

export default function DraftDisplay({
  draft,
  templateTitle,
}: DraftDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(
      draft,
      `${templateTitle || "draft"}_${
        new Date().toISOString().split("T")[0]
      }.md`,
      "text/markdown"
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Generated Draft</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <CheckCircle size={16} className="mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Copy
              </>
            )}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 max-h-[600px] overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-serif text-gray-900 leading-relaxed">
            {draft}
          </pre>
        </div>
      </div>
    </div>
  );
}
