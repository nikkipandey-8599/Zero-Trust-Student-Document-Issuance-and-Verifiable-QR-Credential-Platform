import { Bell, QrCode } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ title = "Dashboard" }) {
  const { user } = useAuth();
  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "Student";

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-7 sticky top-0 z-10">
      <h1 className="text-sm font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-3">
        <a
          href="/verify"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <QrCode size={13} strokeWidth={1.5} /> Verify a credential
        </a>

        <button
          className="relative w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white" />
        </button>

        <span className="text-sm font-medium text-gray-700">Hi, {firstName}</span>
      </div>
    </header>
  );
}