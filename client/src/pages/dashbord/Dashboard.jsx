import { useState } from "react";
import DashboardView from "./DashboardView";
import { useAuthStore } from "../../store/useAuthStore";

// Mock data shaped like what your API/store would return.
// Replace with real store calls (e.g. useDocumentStore, useActivityStore) when wired up.
const MOCK_STATS = {
  totalDocuments: 4218,
  storageUsedGB: 128.4,
  storageLimitGB: 500,
  pendingApprovals: 17,
  activeUsers: 86,
};

const MOCK_DOCUMENTS = [
  { id: "d1", name: "Vendor Agreement - Acme Corp.pdf", folder: "Contracts", owner: "Priya Sharma", updatedAt: "2026-06-27T14:30:00Z", status: "approved", size: "2.4 MB" },
  { id: "d2", name: "Q2 Financial Audit.xlsx", folder: "Finance", owner: "Rohit Mehta", updatedAt: "2026-06-27T09:12:00Z", status: "pending", size: "1.1 MB" },
  { id: "d3", name: "Employee Handbook v3.docx", folder: "HR Policies", owner: "Ananya Iyer", updatedAt: "2026-06-26T18:05:00Z", status: "approved", size: "640 KB" },
  { id: "d4", name: "NDA - Skyline Logistics.pdf", folder: "Contracts", owner: "Priya Sharma", updatedAt: "2026-06-26T11:20:00Z", status: "rejected", size: "318 KB" },
  { id: "d5", name: "Office Lease Renewal.pdf", folder: "Legal", owner: "Karan Desai", updatedAt: "2026-06-25T16:40:00Z", status: "pending", size: "4.8 MB" },
  { id: "d6", name: "Brand Guidelines 2026.pdf", folder: "Marketing", owner: "Sneha Kulkarni", updatedAt: "2026-06-24T10:00:00Z", status: "approved", size: "12.2 MB" },
];

const MOCK_ACTIVITY = [
  { id: "a1", actor: "Rohit Mehta", action: "uploaded", target: "Q2 Financial Audit.xlsx", timestamp: "2026-06-27T09:12:00Z" },
  { id: "a2", actor: "Priya Sharma", action: "shared", target: "Vendor Agreement - Acme Corp.pdf", detail: "with Finance team", timestamp: "2026-06-27T08:50:00Z" },
  { id: "a3", actor: "Admin", action: "changed role of", target: "Karan Desai", detail: "to Manager", timestamp: "2026-06-26T19:15:00Z" },
  { id: "a4", actor: "Ananya Iyer", action: "edited", target: "Employee Handbook v3.docx", timestamp: "2026-06-26T18:05:00Z" },
  { id: "a5", actor: "System", action: "auto-archived", target: "12 documents", detail: "from Legal (90+ days inactive)", timestamp: "2026-06-26T03:00:00Z" },
  { id: "a6", actor: "Karan Desai", action: "rejected", target: "NDA - Skyline Logistics.pdf", timestamp: "2026-06-26T11:22:00Z" },
];

const MOCK_FOLDERS = [
  { id: "f1", name: "Contracts", documentCount: 842, accessLevel: "Restricted" },
  { id: "f2", name: "Finance", documentCount: 1204, accessLevel: "Restricted" },
  { id: "f3", name: "HR Policies", documentCount: 318, accessLevel: "Team" },
  { id: "f4", name: "Legal", documentCount: 567, accessLevel: "Restricted" },
  { id: "f5", name: "Marketing", documentCount: 905, accessLevel: "Org-wide" },
  { id: "f6", name: "Engineering", documentCount: 382, accessLevel: "Team" },
];

const Dashboard = () => {
  const [dashboardState, setDashboardState] = useState({
    isSidebarCollapsed: false,
    searchQuery: "",
    activeFolder: null,
  });

  // In your real app this would come from useAuthStore (role, name, org, etc).
  const { authUser } = useAuthStore();

  const handleToggleSidebar = () => {
    setDashboardState((prevState) => ({
      ...prevState,
      isSidebarCollapsed: !prevState.isSidebarCollapsed,
    }));
  };

  const handleSearchChange = (e) => {
    setDashboardState((prevState) => ({
      ...prevState,
      searchQuery: e.target.value,
    }));
  };

  const handleFolderSelect = (folderId) => {
    setDashboardState((prevState) => ({
      ...prevState,
      activeFolder: folderId,
    }));
  };

  return (
    <DashboardView
      dashboardState={dashboardState}
      authUser={authUser}
      stats={MOCK_STATS}
      documents={MOCK_DOCUMENTS}
      activity={MOCK_ACTIVITY}
      folders={MOCK_FOLDERS}
      handleToggleSidebar={handleToggleSidebar}
      handleSearchChange={handleSearchChange}
      handleFolderSelect={handleFolderSelect}
    />
  );
};

export default Dashboard;
