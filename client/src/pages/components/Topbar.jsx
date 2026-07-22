import { useState } from "react";
import { BellIcon, LogOutIcon, MenuIcon, SearchIcon } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore.js";

const Topbar = ({ searchQuery, onSearchChange, onToggleSidebar, authUser, searchPlaceholder }) => {
  const [isMenuOpen, setisMenuOpen] = useState(false);

  const { logout } = useAuthStore();

  const displayName = authUser?.name || "Admin User";
  const roleName = authUser?.role?.roleName || "Administrator";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 h-16 px-4 md:px-6 bg-white border-b border-gray-200">
      <button type="button" onClick={onToggleSidebar} className="md:hidden text-gray-600">
        <MenuIcon className="size-6" />
      </button>

      <div className="flex-1">
        <div className="max-w-md">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20 transition-all duration-200">
            <SearchIcon className="size-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder={searchPlaceholder || "Search documents, folders, people..."}
              className="w-full text-sm focus:outline-none"
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-5">
        <button type="button" className="relative text-gray-500 hover:text-gray-700">
          <BellIcon className="size-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <div
          onClick={() => setisMenuOpen(!isMenuOpen)}
          className="relative hidden sm:flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer"
        >
          <div className="bg-blue-800 text-white w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
            {initial}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-gray-500">{roleName}</p>
          </div>
          {isMenuOpen && (
            <div className="absolute top-11 right-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <button
                onClick={() => logout()}
                className="flex gap-2 items-center px-4 py-2 text-sm w-full text-red-500 hover:bg-gray-100 "
              >
              <LogOutIcon className="size-4"/>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Topbar;
