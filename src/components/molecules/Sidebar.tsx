import { NavLink } from "react-router";
import {
  FileInput,
  FileText,
  Layout as LayoutIcon,
  Settings,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

function Sidebar() {
  const {
    user: { isAdmin },
  } = useAuth();

  return (
    <aside className="w-80 bg-gradient-to-b from-[#0a294f] to-[#11366b]">
      {/* <aside className="w-80 bg-gradient-to-b from-[#0a294f] to-[#11366b] border-r border-neutral-200"> */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <FileText className="text-white size-6" />
          <h1 className="text-xl font-semibold text-white">Forms Designer</h1>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {!isAdmin ? (
          <NavLink
            to="/forms"
            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors bg-white/20 text-white"
          >
            <FileInput className="h-5 w-5" />
            Forms
          </NavLink>
        ) : (
          <>
            <NavLink
              to="/templates"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/40 hover:bg-white/5"
                }`
              }
            >
              <LayoutIcon className="h-5 w-5" />
              Templates
            </NavLink>
            <NavLink
              to="/forms"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/40 hover:bg-white/5"
                }`
              }
            >
              <FileInput className="h-5 w-5" />
              Forms Management
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/40 hover:bg-white/5"
                }`
              }
            >
              <Settings className="h-5 w-5" />
              Services
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
