import { useState } from "react";

import { FolderIcon, FileTextIcon, PlusIcon, ChevronRightIcon, Trash2Icon, PencilIcon } from "lucide-react";
import { formatRelativeTime } from "../../lib/utils.js";

import Modal from "../components/Modal.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatusStamp from "../components/StatusStamp.jsx";

const CreateFolderModal = ({ onClose, onConfirm }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Folder name is required.");
      return;
    }
    onConfirm(name.trim());
  };

  return (
    <Modal
      title="Create folder"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg">
            Create
          </button>
        </>
      }
    >
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Folder name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError("");
        }}
        placeholder="e.g. Vendor Contracts"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20"
        autoFocus
      />
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </Modal>
  );
};

const Breadcrumb = ({ path, onNavigate }) => (
  <div className="flex items-center gap-1.5 text-sm">
    <button type="button" onClick={() => onNavigate(null)} className="text-gray-500 hover:text-blue-700 font-medium">
      Root
    </button>
    {path.map((folder) => (
      <span key={folder.id} className="flex items-center gap-1.5">
        <ChevronRightIcon className="size-3.5 text-gray-300" />
        <button type="button" onClick={() => onNavigate(folder.id)} className="text-gray-500 hover:text-blue-700 font-medium">
          {folder.name}
        </button>
      </span>
    ))}
  </div>
)

const FoldersPageView = (props) => {
  const {
    foldersState,
    authUser,
    breadcrumbPath,
    subfolders,
    documentsInFolder,
    handleToggleSidebar,
    handleSearchChange,
    handleNavigate,
    handleFolderOpen,
    handleBreadcrumbNavigate,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
  } = props;

  const { isSidebarCollapsed, searchQuery, isCreateOpen } = foldersState;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} activeItem="folders" onNavigate={handleNavigate} />

      <div className="flex-1 min-w-0">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onToggleSidebar={handleToggleSidebar}
          authUser={authUser}
          searchPlaceholder="Search folders..."
        />

        <main className="p-4 md:p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold">Folders</h1>
              <Breadcrumb path={breadcrumbPath} onNavigate={handleBreadcrumbNavigate} />
            </div>
            <button
              type="button"
              onClick={handleCreateFolder.open}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              <PlusIcon className="size-4" />
              New folder
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="font-semibold">Subfolders</h2>
            </div>
            {subfolders.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-500">No subfolders here yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
                {subfolders.map((folder) => (
                  <div
                    key={folder.id}
                    className="group flex items-start gap-3 border border-gray-200 rounded-lg p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all duration-150"
                  >
                    <button type="button" onClick={() => handleFolderOpen(folder)} className="flex items-start gap-3 flex-1 min-w-0 text-left">
                      <div className="bg-slate-100 text-slate-700 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                        <FolderIcon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{folder.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{folder.documentCount} documents</p>
                      </div>
                    </button>
                    <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => handleRenameFolder(folder)} title="Rename" className="p-1 text-gray-400 hover:text-blue-700">
                        <PencilIcon className="size-3.5" />
                      </button>
                      <button type="button" onClick={() => handleDeleteFolder(folder.id)} title="Delete" className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2Icon className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="font-semibold">Documents in this folder</h2>
            </div>
            {documentsInFolder.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-500">No documents in this folder yet.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {documentsInFolder.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors duration-150">
                    <div className="bg-blue-50 text-blue-700 w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
                      <FileTextIcon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.owner} · {doc.size}</p>
                    </div>
                    <div className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">{formatRelativeTime(doc.updatedAt)}</div>
                    <StatusStamp status={doc.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {isCreateOpen && <CreateFolderModal onClose={handleCreateFolder.close} onConfirm={handleCreateFolder.confirm} />}
    </div>
  );
};

export default FoldersPageView;