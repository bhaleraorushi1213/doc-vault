import { useState, useMemo } from "react";
import { useNavigate } from "react-router";

import { useAuthStore } from "../../store/useAuthStore.js";

import FoldersViewPage from "./FoldersViewPage";

// Replace with real API calls (GET /api/folders?parent=<id>, POST /api/folders,
// PATCH /api/folders/:id, DELETE /api/folders/:id) when wiring this up for real.
const MOCK_FOLDERS = [
  { id: "f1", name: "Contracts", parent: null, documentCount: 2 },
  { id: "f2", name: "Finance", parent: null, documentCount: 1 },
  { id: "f3", name: "HR Policies", parent: null, documentCount: 1 },
  { id: "f4", name: "Legal", parent: null, documentCount: 0 },
  { id: "f5", name: "Marketing", parent: null, documentCount: 1 },
  { id: "f1a", name: "Vendor Agreements", parent: "f1", documentCount: 3 },
  { id: "f1b", name: "NDAs", parent: "f1", documentCount: 5 },
];

const MOCK_DOCUMENTS = [
  { id: "d1", name: "Vendor Agreement - Acme Corp.pdf", folder: "f1", owner: "Priya Sharma", updatedAt: "2026-06-27T14:30:00Z", status: "approved", size: "2.4 MB" },
  { id: "d2", name: "Q2 Financial Audit.xlsx", folder: "f2", owner: "Rohit Mehta", updatedAt: "2026-06-27T09:12:00Z", status: "pending", size: "1.1 MB" },
  { id: "d3", name: "Employee Handbook v3.docx", folder: "f3", owner: "Ananya Iyer", updatedAt: "2026-06-26T18:05:00Z", status: "approved", size: "640 KB" },
  { id: "d4", name: "NDA - Skyline Logistics.pdf", folder: "f1", owner: "Priya Sharma", updatedAt: "2026-06-26T11:20:00Z", status: "rejected", size: "318 KB" },
  { id: "d6", name: "Brand Guidelines 2026.pdf", folder: "f5", owner: "Sneha Kulkarni", updatedAt: "2026-06-24T10:00:00Z", status: "approved", size: "12.2 MB" },
];

const FoldersPage = () => {
  const [folders, setFolders] = useState(MOCK_FOLDERS);
  const [documents] = useState(MOCK_DOCUMENTS);
  const [foldersState, setFoldersState] = useState({
    isSidebarCollapsed: false,
    searchQuery: "",
    currentFolderId: null,
    isCreateOpen: false,
  });

  const { authUser } = useAuthStore();

  const navigate = useNavigate();

  // build the breadcrumb trail by walking up from the current folder's parent chain
  const breadcrumbPath = useMemo(() => {
    const path = [];
    let currentId = foldersState.currentFolderId;
    while (currentId) {
      const folder = folders.find((f) => f.id === currentId);
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parent;
    }
    return path;
  }, [foldersState.currentFolderId, folders]);

  const subfolders = folders.filter((f) => f.parent === foldersState.currentFolderId);
  const documentsInFolder = documents.filter((d) => d.folder === foldersState.currentFolderId);

  const handleToggleSidebar = () => {
    setFoldersState((prev) => ({ ...prev, isSidebarCollapsed: !prev.isSidebarCollapsed }));
  };

  const handleSearchChange = (e) => {
    setFoldersState((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleNavigate = (item) => {
    navigate(item.path);
  };

  const handleFolderOpen = (folder) => {
    setFoldersState((prev) => ({ ...prev, currentFolderId: folder.id }));
  };

  const handleBreadcrumbNavigate = (folderId) => {
    setFoldersState((prev) => ({ ...prev, currentFolderId: folderId }));
  };

  const handleCreateFolder = {
    open: () => setFoldersState((prev) => ({ ...prev, isCreateOpen: true })),
    close: () => setFoldersState((prev) => ({ ...prev, isCreateOpen: false })),
    confirm: (name) => {
      // real version: POST /api/folders with { name, parent: foldersState.currentFolderId }
      setFolders((prev) => [
        ...prev,
        { id: `f${prev.length + 1}`, name, parent: foldersState.currentFolderId, documentCount: 0 },
      ]);
      setFoldersState((prev) => ({ ...prev, isCreateOpen: false }));
    },
  };

  const handleRenameFolder = (folder) => {
    // real version: open a rename modal, then PATCH /api/folders/:id with { name }
    const newName = window.prompt("Rename folder", folder.name);
    if (newName?.trim()) {
      setFolders((prev) => prev.map((f) => (f.id === folder.id ? { ...f, name: newName.trim() } : f)));
    }
  };

  const handleDeleteFolder = (folderId) => {
    // real version: DELETE /api/folders/:id - backend already blocks this if the
    // folder still has subfolders or documents in it, surface that error here
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
  };

  return (
    <FoldersViewPage
      foldersState={foldersState}
      authUser={authUser}
      breadcrumbPath={breadcrumbPath}
      subfolders={subfolders}
      documentsInFolder={documentsInFolder}
      handleToggleSidebar={handleToggleSidebar}
      handleSearchChange={handleSearchChange}
      handleNavigate={handleNavigate}
      handleFolderOpen={handleFolderOpen}
      handleBreadcrumbNavigate={handleBreadcrumbNavigate}
      handleCreateFolder={handleCreateFolder}
      handleRenameFolder={handleRenameFolder}
      handleDeleteFolder={handleDeleteFolder}
    />
  );
};

export default FoldersPage;