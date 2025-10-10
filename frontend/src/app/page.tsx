import Link from "next/link";
import { Upload, MessageSquare, FolderOpen, History } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome to LexiDraft</h1>
      <p className="text-gray-600 mb-8">
        Convert legal documents into reusable templates and draft new documents
        with AI
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Upload Card */}
        <Link href="/upload">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-8 cursor-pointer border border-gray-200 hover:border-primary-500">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Upload className="text-primary-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Upload New Template</h2>
            <p className="text-gray-600">
              Convert your legal documents (DOCX/PDF) into reusable templates
              with variables
            </p>
          </div>
        </Link>

        {/* Chat/Draft Card */}
        <Link href="/chat">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-8 cursor-pointer border border-gray-200 hover:border-primary-500">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="text-primary-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Start Drafting</h2>
            <p className="text-gray-600">
              Create new documents using AI-powered conversational interface
            </p>
          </div>
        </Link>

        {/* Templates Library Card */}
        <Link href="/templates">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-8 cursor-pointer border border-gray-200 hover:border-primary-500">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FolderOpen className="text-primary-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Templates Library</h2>
            <p className="text-gray-600">
              Browse, manage, and edit your saved document templates
            </p>
          </div>
        </Link>

        {/* History Card */}
        <Link href="/history">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-8 cursor-pointer border border-gray-200 hover:border-primary-500">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <History className="text-primary-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Draft History</h2>
            <p className="text-gray-600">
              View and manage previously generated documents
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-500">
          No recent activity yet. Start by uploading a template or drafting a
          document.
        </p>
      </div>
    </div>
  );
}
