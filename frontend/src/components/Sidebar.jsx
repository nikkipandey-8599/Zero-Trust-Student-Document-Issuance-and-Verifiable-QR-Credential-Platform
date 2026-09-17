import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LayoutDashboard, FilePlus, Clock, FolderOpen, ShieldCheck, LogOut } from "lucide-react";

const nav = [
  { to: "/dashboard",    icon: LayoutDashboard, label: "Dashboard"        },
  { to: "/request",      icon: FilePlus,        label: "Request Document" },
  { to: "/track",        icon: Clock,           label: "Track Requests"   },
  { to: "/my-documents", icon: FolderOpen,      label: "My Documents"     },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "ST";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-[22px] border-b border-gray-100">
        <ShieldCheck size={20} strokeWidth={1.5} className="text-blue-500" />
        <span className="text-base font-bold text-gray-900 tracking-tight">VerifyID</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
          Student Portal
        </p>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`
            }
          >
            <Icon size={16} strokeWidth={1.6} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-5 pt-4 border-t border-gray-100 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-[11px] text-gray-400">Student</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
        >
          <LogOut size={14} strokeWidth={1.5} /> Sign out
        </button>
      </div>
    </aside>
  );
}