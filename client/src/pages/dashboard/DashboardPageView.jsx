import {
  ClockIcon,
  FileTextIcon,
  FolderIcon,
  HardDriveIcon,
  ShieldIcon,
  UploadIcon,
} from "lucide-react";

import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/TopBar.jsx";
import { formatRelativeTime } from "../../lib/utils.js";
import StatusStamp from "../components/StatusStamp.jsx";


const StatCard = ({ icon: Icon, label, value, sublabel, accent }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
      <Icon className="size-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">{label}</p>
      <p className="text-xl font-bold leading-tight">{value}</p>
      {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
    </div>
  </div>
);

const StatsRow = ({ stats }) => {
  const storagePercent = Math.round((stats.storageUsedGB / stats.storageLimitGB) * 100);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={FileTextIcon}
        label="Total Documents"
        value={stats.totalDocuments.toLocaleString()}
        sublabel="Across all folders"
        accent="bg-blue-50 text-blue-700"
      />
      <StatCard
        icon={HardDriveIcon}
        label="Storage Used"
        value={`${stats.storageUsedGB} GB`}
        sublabel={`${storagePercent}% of ${stats.storageLimitGB} GB`}
        accent="bg-slate-100 text-slate-700"
      />
      <StatCard
        icon={ClockIcon}
        label="Pending Approvals"
        value={stats.pendingApprovals}
        sublabel="Needs review"
        accent="bg-amber-50 text-amber-700"
      />
      <StatCard
        icon={ShieldIcon}
        label="Active Users"
        value={stats.activeUsers}
        sublabel="Across all roles"
        accent="bg-emerald-50 text-emerald-700"
      />
    </div>
  );
};

const RecentDocuments = ({ documents }) => (
  <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
      <h2 className="font-semibold">Recent Documents</h2>
      <button type="button" className="flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800">
        <UploadIcon className="size-4" />
        Upload
      </button>
    </div>

    <div className="divide-y divide-gray-100">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors duration-150">
          <div className="bg-blue-50 text-blue-700 w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
            <FileTextIcon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{doc.name}</p>
            <p className="text-xs text-gray-500">
              {doc.folder} · {doc.owner} · {doc.size}
            </p>
          </div>
          <div className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">{formatRelativeTime(doc.updatedAt)}</div>
          <StatusStamp status={doc.status} />
        </div>
      ))}
    </div>
  </div>
);

const ActivityFeed = ({ activity }) => (
  <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
    <div className="px-5 py-4 border-b border-gray-200">
      <h2 className="font-semibold">Activity</h2>
    </div>
    <div className="flex flex-col px-5 py-4 gap-4">
      {activity.map((item) => (
        <div key={item.id} className="flex gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm">
              <span className="font-medium">{item.actor}</span>{" "}
              <span className="text-gray-500">{item.action}</span>{" "}
              <span className="font-medium">{item.target}</span>
              {item.detail && <span className="text-gray-500"> {item.detail}</span>}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(item.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ACCESS_LEVEL_CLASSES = {
  "Org-wide": "text-emerald-700 bg-emerald-50",
  Team: "text-blue-700 bg-blue-50",
  Restricted: "text-amber-700 bg-amber-50",
};

const FoldersGrid = ({ folders, onFolderSelect }) => (
  <div className="bg-white border border-gray-200 rounded-lg">
    <div className="px-5 py-4 border-b border-gray-200">
      <h2 className="font-semibold">Folders & Workspaces</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
      {folders.map((folder) => (
        <button
          key={folder.id}
          type="button"
          onClick={() => onFolderSelect(folder.id)}
          className="flex items-start gap-3 border border-gray-200 rounded-lg p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all duration-150"
        >
          <div className="bg-slate-100 text-slate-700 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
            <FolderIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{folder.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{folder.documentCount.toLocaleString()} documents</p>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[11px] font-medium ${ACCESS_LEVEL_CLASSES[folder.accessLevel]}`}>
              {folder.accessLevel}
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const DashboardPageView = (props) => {
  const {
    dashboardState,
    authUser,
    stats,
    documents,
    activity,
    folders,
    handleToggleSidebar,
    handleSearchChange,
    handleFolderSelect,
    handleNavigate
  } = props;

  const { isSidebarCollapsed, searchQuery } = dashboardState;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} activeItem={"overview"} onNavigate={handleNavigate} />

      <div className="flex-1 min-w-0">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onToggleSidebar={handleToggleSidebar}
          authUser={authUser}
        />

        <main className="p-4 md:p-6 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Here's what's happening across your document workspace.</p>
          </div>

          <StatsRow stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentDocuments documents={documents} />
            </div>
            <div>
              <ActivityFeed activity={activity} />
            </div>
          </div>

          <FoldersGrid folders={folders} onFolderSelect={handleFolderSelect} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPageView;
