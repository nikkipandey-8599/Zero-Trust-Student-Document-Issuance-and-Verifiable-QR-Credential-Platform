import { ShieldCheck, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <ShieldCheck size={22} />
          </div>

          <div>
            <div className="text-lg font-bold text-slate-900">
              VerifyID
            </div>

            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Trusted Credentials
            </div>
          </div>
        </button>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <User size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {user.fullName}
                </p>

                <p className="text-xs text-slate-500">
                  {user.role}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}