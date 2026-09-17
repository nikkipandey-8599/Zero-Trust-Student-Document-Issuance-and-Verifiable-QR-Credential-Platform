import { useQuery } from "react-query";
import { ShieldCheck, FileText, Users, Activity, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function AdminPanel() {
  const { data: stats, isLoading: statsLoading } = useQuery(
    "admin-stats",
    () => api.get("/admin/stats").then((r) => r.data),
    { staleTime: 60000 }
  );

  const { data: logs, isLoading: logsLoading } = useQuery(
    "audit-logs",
    () => api.get("/admin/audit-logs?limit=20").then((r) => r.data),
    { staleTime: 30000 }
  );

  const statCards = [
    { label: "Total students",   value: stats?.total_students   ?? "—", icon: Users,     color: "bg-blue-50 text-blue-500"  },
    { label: "Documents issued", value: stats?.total_documents  ?? "—", icon: FileText,  color: "bg-green-50 text-green-500"},
    { label: "Pending requests", value: stats?.pending_requests ?? "—", icon: Activity,  color: "bg-amber-50 text-amber-500"},
    { label: "Revoked creds",    value: stats?.revoked          ?? "—", icon: ShieldCheck,color:"bg-red-50 text-red-500"    },
  ];

  const actionColor = {
    LOGIN: "text-blue-500", DOCUMENT_ISSUED: "text-green-500",
    REQUEST_CREATED: "text-gray-500", REQUEST_REJECTED: "text-red-500",
    CREDENTIAL_REVOKED: "text-purple-500", QR_SCANNED: "text-amber-500",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-7 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} strokeWidth={1.5} className="text-blue-500" />
          <h1 className="text-sm font-semibold text-gray-900">Admin Panel</h1>
        </div>
        <Link to="/staff" className="text-xs text-blue-500 font-medium hover:underline">
          ← Back to requests
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-7 py-7">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={17} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">
                  {statsLoading ? <Loader2 size={16} className="spinning text-gray-300" /> : value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Audit log */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Audit Log</h2>
            <p className="text-xs text-gray-400 mt-0.5">Immutable record of every action on the platform</p>
          </div>

          {logsLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 size={20} className="spinning mr-2" /> Loading logs…
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {logs?.map((log) => (
                <div key={log.id} className="flex items-start gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className={`text-[11px] font-bold mt-0.5 w-36 flex-shrink-0 ${actionColor[log.action] ?? "text-gray-500"}`}>
                    {log.action?.replace(/_/g, " ")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 font-medium truncate">{log.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{log.ip_address}</p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {new Date(log.timestamp).toLocaleString("en-IN", {
                      day: "numeric", month: "short",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}