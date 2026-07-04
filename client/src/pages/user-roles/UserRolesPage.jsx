import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuthStore } from "../../store/useAuthStore.js";

import UserRolesPageView from "./UserRolesPageView.jsx";

// Replace with real API calls (GET /api/users, PATCH /api/users/:id/role)
// when wiring this up for real. This screen should only be reachable by an
// Admin - guard the route itself with authorizeRoles equivalent on the frontend.
const MOCK_USERS = [
  { id: "u1", name: "Priya Sharma", email: "priya.sharma@company.com", role: "Admin", createdAt: "2025-11-02T09:00:00Z" },
  { id: "u2", name: "Karan Desai", email: "karan.desai@company.com", role: "Manager", createdAt: "2025-12-14T09:00:00Z" },
  { id: "u3", name: "Rohit Mehta", email: "rohit.mehta@company.com", role: "Employee", createdAt: "2026-01-20T09:00:00Z" },
  { id: "u4", name: "Ananya Iyer", email: "ananya.iyer@company.com", role: "Employee", createdAt: "2026-02-08T09:00:00Z" },
  { id: "u5", name: "Sneha Kulkarni", email: "sneha.kulkarni@company.com", role: "Manager", createdAt: "2026-03-11T09:00:00Z" },
];

// mirrors lib/seedRoles.js - keep these two in sync if you change the backend seed
const ROLES = [
  {
    name: "Admin",
    permissions: ["document:upload", "document:read", "document:write", "document:delete", "document:approve", "document:share", "folder:create", "folder:manage", "user:manage", "role:manage"],
  },
  {
    name: "Manager",
    permissions: ["document:upload", "document:read", "document:write", "document:approve", "document:share", "folder:create", "folder:manage"],
  },
  {
    name: "Employee",
    permissions: ["document:upload", "document:read", "document:share", "folder:create"],
  },
];

const UserRolesPage = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [usersState, setUsersState] = useState({
    isSidebarCollapsed: false,
    searchQuery: "",
  });

  const { authUser } = useAuthStore();

  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setUsersState((prev) => ({ ...prev, isSidebarCollapsed: !prev.isSidebarCollapsed }));
  };

  const handleSearchChange = (e) => {
    setUsersState((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleNavigate = (item) => {
    navigate(item.path);
  };

  const handleRoleChange = (userId, newRole) => {
    // real version: await fetch(`/api/users/${userId}/role`, { method: "PATCH", body: { roleName: newRole } })
    // the backend already blocks an admin from demoting themselves, but the
    // dropdown is also disabled for the current user as a first line of defense
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  return (
    <UserRolesPageView
      usersState={usersState}
      authUser={authUser}
      users={users}
      roles={ROLES}
      handleToggleSidebar={handleToggleSidebar}
      handleSearchChange={handleSearchChange}
      handleNavigate={handleNavigate}
      handleRoleChange={handleRoleChange}
    />
  );
};

export default UserRolesPage;