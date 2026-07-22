import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuthStore } from "../../store/useAuthStore.js";
import { useFolderStore } from "../../store/useFolderStore.js";

import FoldersPageView from "./FoldersPageView";
import { useDocumentStore } from "../../store/useDocumentStore.js";

const FoldersPage = () => {
  // const [folders, setFolders] = useState(MOCK_FOLDERS);
  // const [documents] = useState(MOCK_DOCUMENTS);
  const [foldersState, setFoldersState] = useState({
    isSidebarCollapsed: false,
    searchQuery: "",
    currentFolderId: null,
    isCreateOpen: false,
  });

  const { authUser } = useAuthStore();

  const { folders, getFolders, setFolders } = useFolderStore();
  const { documents, getDocuments } = useDocumentStore();

  useEffect(() => {
    getFolders();
  }, [getFolders])

  const navigate = useNavigate();

  const mock_folders = [
    {
      "_id": "6a48dc2b6a50f1901beccbf1",
      "folderName": "docs",
      "parent": null,
      "owner": "6a4630ea89b6d99bd5e810db",
      "createdAt": "2026-07-04T10:10:51.458Z",
      "updatedAt": "2026-07-04T10:10:51.458Z",
      "__v": 0
    },
    {
      "_id": "6a48dc1f6a50f1901beccbef",
      "folderName": "temp",
      "parent": null,
      "owner": "6a4630ea89b6d99bd5e810db",
      "createdAt": "2026-07-04T10:10:39.285Z",
      "updatedAt": "2026-07-04T10:10:39.285Z",
      "__v": 0
    }
  ]

  const file = [
    {
      "_id": "6a48e0ff6a50f1901beccbf3",
      "fileName": "Marksheets_merged.pdf",
      "fileUrl": "E:\\Projects\\doc-vault\\server\\uploads\\1783161087374-743428864.pdf",
      "fileSize": 861486,
      "fileType": "application/pdf",
      "folder": "6a48dc1f6a50f1901beccbef",
      "uploadedBy": "6a4630ea89b6d99bd5e810db",
      "approvalStatus": "Pending",
      "__v": 0
    },
    {
      "_id": "6a4925ea36b2e754c1a2dc79",
      "fileName": "Marksheets_merged.pdf",
      "fileUrl": "1783178730116-19253773.pdf",
      "fileSize": 861486,
      "fileType": "application/pdf",
      "folder": "6a48dc1f6a50f1901beccbef",
      "uploadedBy": "6a4630ea89b6d99bd5e810db",
      "approvalStatus": "Pending",
      "__v": 0
    }
  ]

  // build the breadcrumb trail by walking up from the current folder's parent chain
  const breadcrumbPath = useMemo(() => {
    const path = [];
    let currentId = foldersState.currentFolderId;
    while (currentId) {
      const folder = folders.find((f) => f._id === currentId);
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parent;
    }
    return path;
  }, [foldersState.currentFolderId, folders]);

  const subfolders = folders.filter((f) => {
    // console.log("f", f.parent)
    // console.log("currentFolderId", foldersState.currentFolderId)
    return f.parent === foldersState.currentFolderId;
  });

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

  const handleFolderOpen = async (folder) => {
    await getFolders(folder._id);
    await getDocuments(folder._id);
    setFoldersState((prev) => ({ ...prev, currentFolderId: folder._id }));
  };

  const handleBreadcrumbNavigate = async (folderId) => {
    await getFolders(folderId);
    setFoldersState((prev) => ({ ...prev, currentFolderId: folderId ? folderId : null }));
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
    const newName = window.prompt("Rename folder", folder.folderName);
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
    <FoldersPageView
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