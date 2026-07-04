import { useState } from "react";
import {
  DownloadIcon,
  FileTextIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
  UploadIcon,
} from "lucide-react";

import Modal from "../components/Modal"
import { formatRelativeTime } from "../../lib/utils.js";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/TopBar.jsx";
import StatusStamp from "../components/StatusStamp.jsx";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

const RejectModal = ({ document, onClose, onConfirm }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) {
      setError("A comment is required when rejecting a document.");
      return;
    }
    onConfirm(document.id, comment.trim());
  };

  return (
    <Modal
      title={`Reject "${document.name}"`}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Reject document
          </button>
        </>
      }
    >
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Reason for rejection
      </label>
      <textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          if (error) setError("");
        }}
        rows={4}
        placeholder="Explain what needs to change before this can be approved..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20"
      />
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </Modal>
  );
};

const UploadModal = ({ folders, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [folderId, setFolderId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    onUpload(file, folderId || null);
  };

  return (
    <Modal
      title="Upload document"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg"
          >
            Upload
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">File</label>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              if (error) setError("");
            }}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-800 file:text-sm file:font-medium hover:file:bg-blue-100"
          />
          {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Folder (optional)</label>
          <select
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20"
          >
            <option value="">Root</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};

const DocumentRow = ({ doc, canApprove, canDelete, onDownload, onDelete, onApprove, onReject }) => (
  <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors duration-150">
    <div className="bg-blue-50 text-blue-700 w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
      <FileTextIcon className="size-4" />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium truncate">{doc.name}</p>
      <p className="text-xs text-gray-500">
        {doc.folder || "Root"} · {doc.owner} · {doc.size}
      </p>
      {doc.status === "rejected" && doc.rejectionComment && (
        <p className="text-xs text-red-600 mt-1">Reason: {doc.rejectionComment}</p>
      )}
    </div>

    <div className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">
      {formatRelativeTime(doc.updatedAt)}
    </div>

    <StatusStamp status={doc.status} />

    <div className="flex items-center gap-1 pl-2">
      <button
        type="button"
        onClick={() => onDownload(doc)}
        title="Download"
        className="p-1.5 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
      >
        <DownloadIcon className="size-4" />
      </button>

      {canApprove && doc.status === "pending" && (
        <>
          <button
            type="button"
            onClick={() => onApprove(doc.id)}
            title="Approve"
            className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
          >
            <CheckIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onReject(doc)}
            title="Reject"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
          >
            <XIcon className="size-4" />
          </button>
        </>
      )}

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(doc.id)}
          title="Delete"
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2Icon className="size-4" />
        </button>
      )}
    </div>
  </div>
);

const DocumentsPageView = (props) => {
  const {
    documentsState,
    authUser,
    documents,
    folders,
    handleToggleSidebar,
    handleSearchChange,
    handleNavigate,
    handleFilterChange,
    handleDownload,
    handleDelete,
    handleApprove,
    handleReject,
    handleUpload,
  } = props;

  const { isSidebarCollapsed, searchQuery, activeFilter, rejectTarget, isUploadOpen } = documentsState;

  // Employees don't have document:approve; Admin/Manager do (matches backend permissions)
  const canApprove = ["Admin", "Manager"].includes(authUser?.role?.roleName);
  // only Admin has document:delete in the current role seed
  const canDelete = authUser?.role?.roleName === "Admin";

  const filteredDocuments = documents.filter((doc) => {
    const matchesFilter = activeFilter === "All" || doc.status === activeFilter.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleToggleSidebar}
        activeItem="documents"
        onNavigate={handleNavigate}
      />

      <div className="flex-1 min-w-0">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onToggleSidebar={handleToggleSidebar}
          authUser={authUser}
          searchPlaceholder="Search documents..."
        />

        <main className="p-4 md:p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold">Documents</h1>
              <p className="text-gray-500 text-sm mt-1">All documents you have access to.</p>
            </div>
            <button
              type="button"
              onClick={() => handleUpload.open()}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              <UploadIcon className="size-4" />
              Upload document
            </button>
          </div>

          <div className="flex items-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  activeFilter === filter ? "bg-blue-800 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
            {filteredDocuments.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-gray-500">
                No documents match your filters.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredDocuments.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    canApprove={canApprove}
                    canDelete={canDelete}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onApprove={handleApprove}
                    onReject={handleReject.open}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {rejectTarget && (
        <RejectModal document={rejectTarget} onClose={handleReject.close} onConfirm={handleReject.confirm} />
      )}

      {isUploadOpen && (
        <UploadModal folders={folders} onClose={handleUpload.close} onUpload={handleUpload.confirm} />
      )}
    </div>
  );
};

export default DocumentsPageView;