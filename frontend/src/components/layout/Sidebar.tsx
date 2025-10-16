"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Upload,
  MessageSquare,
  FolderOpen,
  History,
  FileText,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Upload Template", href: "/upload", icon: Upload },
  { name: "Draft Document", href: "/chat", icon: MessageSquare },
  { name: "Templates", href: "/templates", icon: FolderOpen },
  { name: "History", href: "/history", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">LexiDraft</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-primary-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-primary-900 mb-1">
            Need Help?
          </p>
          <p className="text-xs text-primary-700">Check our documentation</p>
        </div>
      </div>
    </aside>
  );
}
