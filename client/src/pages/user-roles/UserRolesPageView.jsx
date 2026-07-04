import { formatRelativeTime } from "../../lib/utils.js";
import RoleBadge from "../components/RoleBadge.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

const ROLE_OPTIONS = ["Admin", "Manager", "Employee"];

const UserRow = ({ user, isSelf, onRoleChange }) => (
  <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors duration-150">
    <div className="bg-blue-800 text-white w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
      {user.name.charAt(0).toUpperCase()}
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium truncate">
        {user.name} {isSelf && <span className="text-xs text-gray-400 font-normal">(you)</span>}
      </p>
      <p className="text-xs text-gray-500 truncate">{user.email}</p>
    </div>

    <div className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">
      Joined {formatRelativeTime(user.createdAt)}
    </div>

    <RoleBadge roleName={user.role} />

    <select
      value={user.role}
      onChange={(e) => onRoleChange(user.id, e.target.value)}
      disabled={isSelf}
      title={isSelf ? "You can't change your own role" : "Change role"}
      className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-blue-300"
    >
      {ROLE_OPTIONS.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  </div>
);


const RolesSummary = ({ roles }) => (
  <div className="bg-white border border-gray-200 rounded-lg">
    <div className="px-5 py-4 border-b border-gray-200">
      <h2 className="font-semibold">Role permissions</h2>
      <p className="text-xs text-gray-500 mt-0.5">What each role can do across the workspace.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
      {roles.map((role) => (
        <div key={role.name} className="p-5">
          <p className="text-sm font-semibold mb-2">{role.name}</p>
          <ul className="flex flex-col gap-1.5">
            {role.permissions.map((permission) => (
              <li key={permission} className="text-xs text-gray-600 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                {permission}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const UserRolesPageView = (props) => {
  const {
    usersState,
    authUser,
    users,
    roles,
    handleToggleSidebar,
    handleSearchChange,
    handleNavigate,
    handleRoleChange,
  } = props;

  const { isSidebarCollapsed, searchQuery } = usersState;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} activeItem="users" onNavigate={handleNavigate} />

      <div className="flex-1 min-w-0">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onToggleSidebar={handleToggleSidebar}
          authUser={authUser}
          searchPlaceholder="Search people..."
        />

        <main className="p-4 md:p-6 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Users & roles</h1>
            <p className="text-gray-500 text-sm mt-1">Manage who has access and what they can do.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="font-semibold">All users</h2>
            </div>
            {filteredUsers.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-500">No users match your search.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isSelf={user.id === authUser?._id}
                    onRoleChange={handleRoleChange}
                  />
                ))}
              </div>
            )}
          </div>

          <RolesSummary roles={roles} />
        </main>
      </div>
    </div>
  );
};

export default UserRolesPageView;