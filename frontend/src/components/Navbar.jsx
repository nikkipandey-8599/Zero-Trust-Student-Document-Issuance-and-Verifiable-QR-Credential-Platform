import { LogOut, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const isStaff =
    user?.role === "STAFF" ||
    user?.role === "ADMIN";

  const dashboardPath = isStaff
    ? "/staff"
    : "/student";

  return (
    <header className="border-b border-[#DDD5DF] bg-[#F8F5EF]">

      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to={dashboardPath}
          className="group flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
          aria-label="Go to VerifyID dashboard"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8E7AA8] shadow-sm transition group-hover:bg-[#796591]">

            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 3.2L19 6.1V11.2C19 15.9 16.1 19.2 12 21C7.9 19.2 5 15.9 5 11.2V6.1L12 3.2Z"
                stroke="white"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />

              <path
                d="M8.7 12.1L10.8 14.2L15.4 9.7"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

          </div>

          <div className="leading-none">

            <p className="font-heading text-[20px] font-bold tracking-tight text-[#292632]">
              VerifyID
            </p>

            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#735F87]">
              Trusted Credentials
            </p>

          </div>

        </Link>

        {/* User section */}
        {user && (
          <div className="flex items-center gap-3 sm:gap-5">

            <div className="hidden items-center gap-3 sm:flex">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEE9F3] text-[#735F87]">
                <UserRound size={17} />
              </div>

              <div className="leading-tight">

                <p className="max-w-[190px] truncate text-sm font-bold text-[#292632]">
                  {user?.fullName || user?.email || "User"}
                </p>

                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-[#735F87]">
                  {user?.role || "USER"}
                </p>

              </div>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEE9F3] text-[#735F87] sm:hidden">
              <UserRound size={17} />
            </div>

            <button
              onClick={logout}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D5CBDD] bg-white px-3.5 text-sm font-bold text-[#4F4558] shadow-sm transition hover:bg-[#F0EBF4] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>
        )}

      </div>

    </header>
  );
}