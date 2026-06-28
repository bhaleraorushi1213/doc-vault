import {
  BellIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  FolderIcon,
  HardDriveIcon,
  LayoutDashboardIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  UploadIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";

// --- helpers -----------------------------------------------------------

const formatRelativeTime = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
};

const STATUS_CONFIG = {
  approved: { label: "Approved", icon: CheckCircle2Icon, classes: "text-emerald-700 border-emerald-300 bg-emerald-50" },
  pending: { label: "Pending", icon: ClockIcon, classes: "text-amber-700 border-amber-300 bg-amber-50" },
  rejected: { label: "Rejected", icon: XCircleIcon, classes: "text-red-600 border-red-300 bg-red-50" },
};

// Stamp-style status badge — the signature element. Slight rotation + bordered
// to read like a physical document stamp rather than a generic status pill.
const StatusStamp = ({ status }) => {
  const config = STATUS_CONFIG[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold uppercase tracking-wide -rotate-2 ${config.classes}`}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  );
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboardIcon },
  { id: "documents", label: "Documents", icon: FileTextIcon },
  { id: "folders", label: "Folders", icon: FolderIcon },
  { id: "users", label: "Users & Roles", icon: UsersIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

// --- sidebar -------------------------------------------------------------

const Sidebar = ({ isCollapsed, onToggle }) => {
  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-200 ${
        isCollapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-gray-200 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="bg-blue-800 text-white w-9 h-9 rounded-lg flex justify-center items-center shrink-0">
          <FileTextIcon className="size-5" />
        </div>
        {!isCollapsed && <span className="font-bold text-lg whitespace-nowrap">DocVault</span>}
      </div>

      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === "overview";
          return (
            <button
              key={item.id}
              type="button"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive ? "bg-blue-50 text-blue-800" : "text-gray-600 hover:bg-gray-100"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="size-5 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-center gap-2 m-2 py-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150 text-sm"
      >
        {isCollapsed ? <ChevronRightIcon className="size-5" /> : <ChevronLeftIcon className="size-5" />}
        {!isCollapsed && <span></span>}
      </button>
    </aside>
  );
};

// --- topbar -------------------------------------------------------------

const Topbar = ({ searchQuery, onSearchChange, onToggleSidebar, authUser }) => {
  const displayName = authUser?.fullName || "Admin User";
  const roleName = authUser?.role || "Administrator";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 h-16 px-4 md:px-6 bg-white border-b border-gray-200">
      <button type="button" onClick={onToggleSidebar} className="md:hidden text-gray-600">
        <MenuIcon className="size-6" />
      </button>

      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20 transition-all duration-200">
          <SearchIcon className="size-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search documents, folders, people..."
            className="w-full text-sm focus:outline-none"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
      </div>

      <button type="button" className="relative text-gray-500 hover:text-gray-700">
        <BellIcon className="size-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">3</span>
      </button>

      <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
        <div className="bg-blue-800 text-white w-9 h-9 rounded-full flex justify-center items-center font-semibold text-sm shrink-0">
          {initial}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{displayName}</p>
          <p className="text-xs text-gray-500">{roleName}</p>
        </div>
      </div>
    </header>
  );
};

// --- stat cards -----------------------------------------------------------

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

// --- recent documents -----------------------------------------------------

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

// --- activity feed ---------------------------------------------------------

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

// --- folders grid -----------------------------------------------------------

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

// --- main view ---------------------------------------------------------

const DashboardView = (props) => {
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
  } = props;

  const { isSidebarCollapsed, searchQuery } = dashboardState;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />

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

export default DashboardView;
