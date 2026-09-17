import { Link } from "react-router-dom";
import { FilePlus, Clock, FolderOpen, ShieldCheck, FileText, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import { useRequests } from "../hooks/useRequests";
import { useDocuments } from "../hooks/useDocuments";
import { useAuth } from "../hooks/useAuth";

const quickActions = [
  { to: "/request",      icon: FilePlus,   title: "Request a document",  desc: "Bonafide, transcript, character certificate and more", iconBg: "bg-blue-50",  iconColor: "text-blue-500"  },
  { to: "/track",        icon: Clock,      title: "Track my requests",   desc: "See live status updates on submitted requests",        iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  { to: "/my-documents", icon: FolderOpen, title: "My documents",        desc: "Download and share your issued credentials",          iconBg: "bg-green-50", iconColor: "text-green-500" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: requests, isLoading: reqLoading, isError: reqError } = useRequests();
  const { data: documents, isLoading: docLoading } = useDocuments();

  const pending  = requests?.filter((r) => r.status === "pending").length  ?? 0;
  const issued   = documents?.length ?? 0;
  const approved = requests?.filter((r) => r.status === "approved").length ?? 0;
  const recent   = requests?.slice(0, 5) ?? [];

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Student";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar title="Dashboard" />
        <div className="max-w-5xl mx-auto w-full px-7 py-8">

          {/* Welcome */}
          <div className="flex items-start justify-between mb-7 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                Welcome back, {firstName}
              </h2>
              <p className="text-sm text-gray-500">Here's an overview of your credentials and requests.</p>
            </div>
            <Link to="/request" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap">
              <FilePlus size={15} strokeWidth={1.6} /> New request
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-7">
            {[
              { icon: FolderOpen, label: "Documents issued",    value: docLoading ? null : issued,   bg: "bg-blue-50",  color: "text-blue-500"  },
              { icon: Clock,      label: "Pending requests",    value: reqLoading ? null : pending,  bg: "bg-amber-50", color: "text-amber-500" },
              { icon: ShieldCheck,label: "Approved this month", value: reqLoading ? null : approved, bg: "bg-green-50", color: "text-green-500" },
            ].map(({ icon: Icon, label, value, bg, color }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                  <Icon size={18} strokeWidth={1.5} className={color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 leading-none mb-1">
                    {value === null ? <Loader2 size={16} className="spinning text-gray-300" /> : value}
                  </p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mb-7">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick actions</h3>
            <div className="flex flex-col gap-2.5">
              {quickActions.map(({ to, icon: Icon, title, desc, iconBg, iconColor }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <Icon size={18} strokeWidth={1.5} className={iconColor} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                  <ChevronRight size={16} strokeWidth={1.5} className="text-gray-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Recent requests</h3>
              <Link to="/track" className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:underline">
                See all <ChevronRight size={12} />
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {reqLoading && (
                <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
                  <Loader2 size={20} className="spinning" /> Loading…
                </div>
              )}
              {reqError && (
                <div className="flex items-center justify-center gap-2 py-12 text-red-400">
                  <AlertCircle size={18} /> Could not load requests. Try refreshing.
                </div>
              )}
              {!reqLoading && !reqError && recent.length === 0 && (
                <div className="flex flex-col items-center py-12 gap-2 text-gray-400">
                  <FileText size={28} strokeWidth={1.2} className="text-gray-300" />
                  <p className="text-sm font-medium text-gray-500">No requests yet</p>
                  <p className="text-xs text-gray-400">Submit your first document request to get started.</p>
                  <Link to="/request" className="mt-2 text-xs font-semibold text-blue-500 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    Request a document
                  </Link>
                </div>
              )}
              {!reqLoading && recent.length > 0 && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Document","Purpose","Date","Status",""].map((h) => (
                        <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((req) => (
                      <tr key={req.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 font-medium text-gray-900">
                            <FileText size={14} strokeWidth={1.4} className="text-blue-400 flex-shrink-0" />
                            {req.doc_type?.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">{req.purpose}</td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(req.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge status={req.status} /></td>
                        <td className="px-5 py-3.5">
                          <Link to="/track" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-blue-500 transition-colors">
                            <ChevronRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ZT strip */}
          <div className="flex items-center gap-2 mt-6 px-4 py-3 bg-gray-100 rounded-lg text-xs text-gray-400">
            <ShieldCheck size={13} strokeWidth={1.5} className="text-blue-400 flex-shrink-0" />
            Your session is continuously verified — every action is logged and protected under Zero-Trust security.
          </div>

        </div>
      </div>
    </div>
  );
}