import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  FileCheck2,
  ShieldCheck,
  Activity,
  XCircle,
  History,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    issued: 0,
    credentials: 0,
    auditEvents: 0,
    system: "...",
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [statsResponse, logsResponse] = await Promise.all([
        api.get("/staff/dashboard/stats"),
        api.get("/staff/dashboard/audit-logs"),
      ]);

      setStats(statsResponse.data);
      setLogs(logsResponse.data);
    } catch (error) {
      console.error("Dashboard loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Staff Portal
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Verification Operations
            </h1>

            <p className="mt-2 text-slate-500">
              Monitor requests, credentials and security activity.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Main stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            href="/staff/requests"
            icon={<ClipboardCheck />}
            label="Pending"
            value={stats.pending}
          />

          <Stat
            href="/staff/requests"
            icon={<FileCheck2 />}
            label="Approved"
            value={stats.approved}
          />

          <Stat
            href="/staff/requests"
            icon={<ShieldCheck />}
            label="Credentials"
            value={stats.credentials}
          />

          <Stat
            href="/staff/requests"
            icon={<Activity />}
            label="System"
            value={stats.system}
          />

        </div>

        {/* Secondary stats */}
        <div className="mt-5 grid gap-5 sm:grid-cols-3">

          <MiniStat
            icon={<FileCheck2 />}
            label="Issued Requests"
            value={stats.issued}
          />

          <MiniStat
            icon={<XCircle />}
            label="Rejected Requests"
            value={stats.rejected}
          />

          <MiniStat
            icon={<History />}
            label="Audit Events"
            value={stats.auditEvents}
          />

        </div>

        {/* Request management */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">

          <h2 className="text-xl font-bold text-slate-900">
            Request management
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Review submitted student document requests and perform
            approval, rejection and credential issuance actions.
          </p>

          <a
            href="/staff/requests"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            View requests
            <ArrowRight size={17} />
          </a>

        </div>

        {/* Audit logs */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white">

          <div className="border-b border-slate-200 p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <History size={20} />
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Security Audit Trail
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Recorded actions across the document issuance workflow.
                </p>

              </div>

            </div>

          </div>

          {loading ? (
            <div className="p-8 text-sm text-slate-500">
              Loading audit events...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-sm text-slate-500">
              No audit events recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {logs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
                >

                  <div>

                    <div className="flex items-center gap-3">

                      <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                        {log.action}
                      </span>

                      <span className="text-xs text-slate-400">
                        {log.resourceType}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-slate-700">
                      {log.details}
                    </p>

                  </div>

                  <div className="text-left md:text-right">

                    <p className="text-xs font-medium text-slate-500">
                      User ID: {log.userId}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(log.createdAt)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      IP: {log.ipAddress}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

function Stat({ icon, label, value, href }) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
    >

      <div className="flex items-center justify-between">

        <div className="text-indigo-600">
          {icon}
        </div>

        <div className="flex items-center gap-2">

          <span className="text-2xl font-bold text-slate-900">
            {value}
          </span>

          <ArrowRight
            size={17}
            className="text-slate-300 transition group-hover:text-indigo-600"
          />

        </div>

      </div>

      <p className="mt-4 text-sm font-medium text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Open request management
      </p>

    </a>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
          {icon}
        </div>

        <div>

          <p className="text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="text-sm text-slate-500">
            {label}
          </p>

        </div>

      </div>

    </div>
  );
}

function formatDate(value) {
  if (!value) return "Unknown";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}