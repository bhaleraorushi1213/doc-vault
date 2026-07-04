import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuthStore } from "../../store/useAuthStore.js";

import SettingsPageView from "./SettingsPageView.jsx";

const SettingsPage = () => {
  const { authUser, logout } = useAuthStore();

  const [settingsState, setSettingsState] = useState({
    isSidebarCollapsed: false,
    searchQuery: "",
    saveStatus: { profile: false, password: false },
  });

  const [profileForm, setProfileForm] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    department: authUser?.department || "",
  });

  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", error: "" });

  const [preferences, setPreferences] = useState({
    emailOnApproval: true,
    emailOnShare: true,
    weeklyDigest: false,
  });

  const navigate = useNavigate()

  const handleToggleSidebar = () => {
    setSettingsState((prev) => ({ ...prev, isSidebarCollapsed: !prev.isSidebarCollapsed }));
  };

  const handleSearchChange = (e) => {
    setSettingsState((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleNavigate = (item) => {
    navigate(item.path);
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = () => {
    // real version: PATCH /api/users/me (or similar) with { name, department }
    setSettingsState((prev) => ({ ...prev, saveStatus: { ...prev.saveStatus, profile: true } }));
    setTimeout(() => {
      setSettingsState((prev) => ({ ...prev, saveStatus: { ...prev.saveStatus, profile: false } }));
    }, 2000);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value, error: "" }));
  };

  const handlePasswordSave = () => {
    if (!passwordForm.current || !passwordForm.next) {
      setPasswordForm((prev) => ({ ...prev, error: "Both fields are required." }));
      return;
    }
    if (passwordForm.next.length < 6) {
      setPasswordForm((prev) => ({ ...prev, error: "New password must be at least 6 characters." }));
      return;
    }
    // real version: PATCH /api/auth/password with { currentPassword, newPassword }
    setSettingsState((prev) => ({ ...prev, saveStatus: { ...prev.saveStatus, password: true } }));
    setPasswordForm({ current: "", next: "", error: "" });
    setTimeout(() => {
      setSettingsState((prev) => ({ ...prev, saveStatus: { ...prev.saveStatus, password: false } }));
    }, 2000);
  };

  const handlePreferenceToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    // real version: POST /api/auth/logout, then redirect to /login
    logout?.();
  };

  return (
    <SettingsPageView
      settingsState={settingsState}
      authUser={authUser}
      profileForm={profileForm}
      passwordForm={passwordForm}
      preferences={preferences}
      handleToggleSidebar={handleToggleSidebar}
      handleSearchChange={handleSearchChange}
      handleNavigate={handleNavigate}
      handleProfileChange={handleProfileChange}
      handleProfileSave={handleProfileSave}
      handlePasswordChange={handlePasswordChange}
      handlePasswordSave={handlePasswordSave}
      handlePreferenceToggle={handlePreferenceToggle}
      handleLogout={handleLogout}
    />
  );
};

export default SettingsPage;