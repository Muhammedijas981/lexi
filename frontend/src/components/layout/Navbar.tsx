"use client";

import { Bell, Settings, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title/Breadcrumb */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-600" />
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">User</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
