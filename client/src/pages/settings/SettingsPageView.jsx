import RoleBadge from "../components/RoleBadge.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

const SettingsSection = ({ title, description, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg">
    <div className="px-5 py-4 border-b border-gray-200">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <div className="p-5 flex flex-col gap-4">{children}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputClasses =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20";

// --- toggle switch ----------------------------------------------------------

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors duration-150 shrink-0 ${
        checked ? "bg-blue-800" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-150 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

const SettingsPageView = (props) => {
  const {
    settingsState,
    authUser,
    profileForm,
    passwordForm,
    preferences,
    handleToggleSidebar,
    handleSearchChange,
    handleNavigate,
    handleProfileChange,
    handleProfileSave,
    handlePasswordChange,
    handlePasswordSave,
    handlePreferenceToggle,
    handleLogout,
  } = props;

  const { isSidebarCollapsed, searchQuery, saveStatus } = settingsState;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} activeItem="settings" onNavigate={handleNavigate} />

      <div className="flex-1 min-w-0">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onToggleSidebar={handleToggleSidebar}
          authUser={authUser}
          searchPlaceholder="Search settings..."
        />

        <main className="p-4 md:p-6 flex flex-col gap-6 max-w-2xl">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your profile, password, and preferences.</p>
          </div>

          <SettingsSection title="Profile" description="This information is visible to your team.">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-800 text-white w-14 h-14 rounded-full flex items-center justify-center font-semibold text-lg shrink-0">
                {profileForm.name.charAt(0).toUpperCase()}
              </div>
              <RoleBadge roleName={authUser?.role?.roleName} />
            </div>

            <Field label="Full name">
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className={inputClasses}
              />
            </Field>

            <Field label="Email">
              <input type="email" value={profileForm.email} disabled className={`${inputClasses} bg-gray-50 text-gray-500`} />
            </Field>

            <Field label="Department">
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => handleProfileChange("department", e.target.value)}
                placeholder="e.g. Finance"
                className={inputClasses}
              />
            </Field>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleProfileSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg"
              >
                Save changes
              </button>
              {saveStatus.profile && <span className="text-xs text-emerald-600">Saved.</span>}
            </div>
          </SettingsSection>

          <SettingsSection title="Password" description="Choose a strong password you don't use elsewhere.">
            <Field label="Current password">
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => handlePasswordChange("current", e.target.value)}
                className={inputClasses}
              />
            </Field>
            <Field label="New password">
              <input
                type="password"
                value={passwordForm.next}
                onChange={(e) => handlePasswordChange("next", e.target.value)}
                placeholder="At least 6 characters"
                className={inputClasses}
              />
            </Field>
            {passwordForm.error && <p className="text-xs text-red-600">{passwordForm.error}</p>}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handlePasswordSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg"
              >
                Update password
              </button>
              {saveStatus.password && <span className="text-xs text-emerald-600">Password updated.</span>}
            </div>
          </SettingsSection>

          <SettingsSection title="Notifications">
            <Toggle
              checked={preferences.emailOnApproval}
              onChange={() => handlePreferenceToggle("emailOnApproval")}
              label="Email me when a document is approved or rejected"
              description="Applies to documents you've uploaded."
            />
            <Toggle
              checked={preferences.emailOnShare}
              onChange={() => handlePreferenceToggle("emailOnShare")}
              label="Email me when a document is shared with me"
            />
            <Toggle
              checked={preferences.weeklyDigest}
              onChange={() => handlePreferenceToggle("weeklyDigest")}
              label="Weekly activity digest"
            />
          </SettingsSection>

          <SettingsSection title="Session">
            <button
              type="button"
              onClick={handleLogout}
              className="self-start px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg"
            >
              Log out
            </button>
          </SettingsSection>
        </main>
      </div>
    </div>
  );
};

export default SettingsPageView;