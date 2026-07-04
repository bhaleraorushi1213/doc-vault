import { ChevronLeftIcon, FileTextIcon } from "lucide-react";
import { NAV_ITEMS } from "../../lib/utils.js";

const Sidebar = ({ isCollapsed, onToggle, activeItem, onNavigate }) => {
  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-200 ${
        isCollapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-3 px-4 h-16 border-b border-gray-200
        hover:bg-gray-50 transition-colors duration-200
        ${isCollapsed ? "justify-center" : "justify-between"}
      `}
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-800 text-white w-9 h-9 rounded-lg flex justify-center items-center shrink-0">
            <FileTextIcon className="size-5" />
          </div>

          {!isCollapsed && (
            <span className="font-bold text-lg whitespace-nowrap">DocVault</span>
          )}
        </div>

        {!isCollapsed && <ChevronLeftIcon className="size-4 text-gray-400" />}
      </button>

      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate?.(item)}
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
    </aside>
  );
};

export default Sidebar;