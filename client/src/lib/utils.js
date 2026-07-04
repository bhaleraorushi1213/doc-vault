import { CheckCircle2Icon, ClockIcon, FileTextIcon, FolderIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon, XCircleIcon } from "lucide-react";

export const STATUS_CONFIG = {
  approved: { label: "Approved", icon: CheckCircle2Icon, classes: "text-emerald-700 border-emerald-300 bg-emerald-50" },
  pending: { label: "Pending", icon: ClockIcon, classes: "text-amber-700 border-amber-300 bg-amber-50" },
  rejected: { label: "Rejected", icon: XCircleIcon, classes: "text-red-600 border-red-300 bg-red-50" },
};

export const ROLE_CLASSES = {
  Admin: "text-purple-700 bg-purple-50 border-purple-200",
  Manager: "text-blue-700 bg-blue-50 border-blue-200",
  Employee: "text-gray-600 bg-gray-50 border-gray-200",
};

export const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboardIcon, path: "/" },
  { id: "documents", label: "Documents", icon: FileTextIcon, path: "/documents" },
  { id: "folders", label: "Folders", icon: FolderIcon, path: "/folders" },
  { id: "users", label: "Users & Roles", icon: UsersIcon, path: "/users" },
  { id: "settings", label: "Settings", icon: SettingsIcon, path: "/settings" },
];

export const formatRelativeTime = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
};
