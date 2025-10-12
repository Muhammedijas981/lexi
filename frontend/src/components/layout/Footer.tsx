export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              © 2025 LexiDraft. Legal Document Templating System.
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Documentation
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              API
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
