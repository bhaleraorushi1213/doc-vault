import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuthStore } from "../../store/useAuthStore.js";

import DocumentsPageView from "./DocumentsPageView";

const MOCK_DOCUMENTS = [
  { id: "d1", name: "Vendor Agreement - Acme Corp.pdf", folder: "Contracts", owner: "Priya Sharma", updatedAt: "2026-06-27T14:30:00Z", status: "approved", size: "2.4 MB" },
  { id: "d2", name: "Q2 Financial Audit.xlsx", folder: "Finance", owner: "Rohit Mehta", updatedAt: "2026-06-27T09:12:00Z", status: "pending", size: "1.1 MB" },
  { id: "d3", name: "Employee Handbook v3.docx", folder: "HR Policies", owner: "Ananya Iyer", updatedAt: "2026-06-26T18:05:00Z", status: "approved", size: "640 KB" },
  { id: "d4", name: "NDA - Skyline Logistics.pdf", folder: "Contracts", owner: "Priya Sharma", updatedAt: "2026-06-26T11:20:00Z", status: "rejected", size: "318 KB", rejectionComment: "Missing signature page - please re-upload the fully executed copy." },
  { id: "d5", name: "Office Lease Renewal.pdf", folder: "Legal", owner: "Karan Desai", updatedAt: "2026-06-25T16:40:00Z", status: "pending", size: "4.8 MB" },
  { id: "d6", name: "Brand Guidelines 2026.pdf", folder: "Marketing", owner: "Sneha Kulkarni", updatedAt: "2026-06-24T10:00:00Z", status: "approved", size: "12.2 MB" },
];

const MOCK_FOLDERS = [
  { id: "f1", name: "Contracts" },
  { id: "f2", name: "Finance" },
  { id: "f3", name: "HR Policies" },
  { id: "f4", name: "Legal" },
  { id: "f5", name: "Marketing" },
];

const DocumentsPage = () => {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [documentsState, setDocumentsState] = useState({
    isSidebarCollapsed: false,
    searchQuery: "",
    activeFilter: "All",
    rejectTarget: null,
    isUploadOpen: false,
  });

  const { authUser } = useAuthStore();

  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setDocumentsState((prev) => ({ ...prev, isSidebarCollapsed: !prev.isSidebarCollapsed }));
  };

  const handleSearchChange = (e) => {
    setDocumentsState((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleFilterChange = (filter) => {
    setDocumentsState((prev) => ({ ...prev, activeFilter: filter }));
  };

  // wire this to your router (react-router's useNavigate, etc)
  const handleNavigate = (item) => {
    console.log("navigate to", item.path);
    navigate(item.path)
  };

  const handleDownload = (doc) => {
    // real version: window.location = `/api/documents/${doc.id}/download`
    console.log("download", doc.id);
  };

  const handleDelete = (docId) => {
    // real version: await fetch(`/api/documents/${docId}`, { method: "DELETE" })
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleApprove = (docId) => {
    // real version: await fetch(`/api/documents/${docId}/status`, { method: "PATCH", body: { status: "Approved" } })
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: "approved", rejectionComment: undefined } : d))
    );
  };

  const handleReject = {
    open: (doc) => setDocumentsState((prev) => ({ ...prev, rejectTarget: doc })),
    close: () => setDocumentsState((prev) => ({ ...prev, rejectTarget: null })),
    confirm: (docId, comment) => {
      // real version: await fetch(`/api/documents/${docId}/status`, { method: "PATCH", body: { status: "Rejected", comment } })
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status: "rejected", rejectionComment: comment } : d))
      );
      setDocumentsState((prev) => ({ ...prev, rejectTarget: null }));
    },
  };

  const handleUpload = {
    open: () => setDocumentsState((prev) => ({ ...prev, isUploadOpen: true })),
    close: () => setDocumentsState((prev) => ({ ...prev, isUploadOpen: false })),
    confirm: (file, folderId) => {
      // real version: build FormData with "file" + "folder", POST to /api/documents
      const folderName = MOCK_FOLDERS.find((f) => f.id === folderId)?.name || null;
      setDocuments((prev) => [
        {
          id: `d${prev.length + 1}`,
          name: file.name,
          folder: folderName,
          owner: authUser?.name || "You",
          updatedAt: new Date().toISOString(),
          status: "pending",
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        },
        ...prev,
      ]);
      setDocumentsState((prev) => ({ ...prev, isUploadOpen: false }));
    },
  };

  return (
    <DocumentsPageView
      documentsState={documentsState}
      authUser={authUser}
      documents={documents}
      folders={MOCK_FOLDERS}
      handleToggleSidebar={handleToggleSidebar}
      handleSearchChange={handleSearchChange}
      handleNavigate={handleNavigate}
      handleFilterChange={handleFilterChange}
      handleDownload={handleDownload}
      handleDelete={handleDelete}
      handleApprove={handleApprove}
      handleReject={handleReject}
      handleUpload={handleUpload}
    />
  );
};

export default DocumentsPage;