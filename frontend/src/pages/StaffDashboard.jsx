import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  History,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
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
    system: "UP",
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [statsResponse, auditResponse] = await Promise.all([
        api.get("/staff/dashboard/stats"),
        api.get("/staff/dashboard/audit-logs"),
      ]);

      const statsData = statsResponse.data || {};
      const auditData = Array.isArray(auditResponse.data)
        ? auditResponse.data
        : [];

      setStats({
        pending: statsData.pending ?? 0,
        approved: statsData.approved ?? 0,
        rejected: statsData.rejected ?? 0,
        issued: statsData.issued ?? 0,
        credentials: statsData.credentials ?? 0,
        auditEvents: statsData.auditEvents ?? auditData.length,
        system: statsData.system ?? "UP",
      });

      setAuditLogs(auditData);
    } catch (err) {
      console.error("Failed to load staff dashboard:", err);
      setError(
        "Unable to load the latest dashboard information. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        {/* Header */}
        <section className="rounded-[24px] border border-[#DDD5E4] bg-[#EEE9F3] px-6 py-7 shadow-sm sm:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#CFC3D9] bg-white px-3 py-1.5 text-xs font-bold text-[#675575]">
                <ShieldCheck size={14} />
                Staff Portal
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#292632] sm:text-4xl">
                Verification Operations
              </h1>

              <p className="mt-2 max-w-2xl text-base leading-6 text-[#5F5964]">
                Review student requests, issue trusted credentials and monitor
                security activity from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-[#CFC3D9] bg-white px-4 text-sm font-bold text-[#594B68] shadow-sm transition hover:bg-[#F1ECF4] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Primary Stats */}
        <section className="mt-8">

          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A668E]">
              Workflow overview
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#292632]">
              Request activity
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              icon={<ClipboardCheck size={21} />}
              label="Pending"
              value={loading ? "—" : stats.pending}
              description="Requests waiting for review"
              accent="lavender"
            />

            <StatCard
              icon={<FileCheck2 size={21} />}
              label="Approved"
              value={loading ? "—" : stats.approved}
              description="Requests approved for issuance"
              accent="green"
            />

            <StatCard
              icon={<CheckCircle2 size={21} />}
              label="Issued"
              value={loading ? "—" : stats.issued}
              description="Documents successfully issued"
              accent="purple"
            />

            <StatCard
              icon={<XCircle size={21} />}
              label="Rejected"
              value={loading ? "—" : stats.rejected}
              description="Requests rejected by staff"
              accent="red"
            />

          </div>
        </section>

        {/* Secondary Stats */}
        <section className="mt-4 grid gap-4 md:grid-cols-3">

          <SecondaryStat
            icon={<ShieldCheck size={20} />}
            label="Credentials"
            value={loading ? "—" : stats.credentials}
            description="Credentials stored in VerifyID"
          />

          <SecondaryStat
            icon={<History size={20} />}
            label="Audit events"
            value={loading ? "—" : stats.auditEvents}
            description="Recorded workflow and security events"
          />

          <SecondaryStat
            icon={<Activity size={20} />}
            label="System"
            value={loading ? "—" : stats.system}
            description="Backend and database health"
            status
          />

        </section>

        {/* Request Management */}
        <section className="mt-8 rounded-[22px] border border-[#E0D8E4] bg-white p-6 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEE9F3] text-[#735F87]">
                <ClipboardCheck size={22} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A668E]">
                  Request management
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#292632]">
                  Review student document requests
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-5 text-[#5F5964]">
                  Review submitted requests, approve or reject them and issue
                  credentials for approved requests.
                </p>
              </div>

            </div>

            <Link
              to="/staff/requests"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#8E7AA8] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
            >
              View requests
              <ArrowRight size={17} />
            </Link>

          </div>

        </section>

        {/* Audit Trail */}
        <section className="mt-8">

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A668E]">
                Security monitoring
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#292632]">
                Recent audit events
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#5F5964]">
              <ShieldCheck size={16} className="text-[#735F87]" />
              Activity is recorded automatically
            </div>

          </div>

          <div className="overflow-hidden rounded-[22px] border border-[#E0D8E4] bg-white shadow-sm">

            {loading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-14 text-sm text-[#5F5964]">
                <Loader2 size={18} className="animate-spin" />
                Loading audit events...
              </div>
            ) : auditLogs.length === 0 ? (
              <EmptyAuditState />
            ) : (
              <div className="divide-y divide-[#E8E2EA]">
                {auditLogs.slice(0, 8).map((log, index) => (
                  <AuditRow
                    key={log.id ?? `${log.action}-${index}`}
                    log={log}
                  />
                ))}
              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  accent,
}) {
  const accentClasses = {
    lavender: "bg-[#EEE9F3] text-[#735F87]",
    green: "bg-[#EEF6F0] text-[#55745D]",
    purple: "bg-[#F1ECF8] text-[#76538F]",
    red: "bg-[#FFF0F0] text-[#A65353]",
  };

  return (
    <Link
      to="/staff/requests"
      className="block rounded-2xl border border-[#E0D8E4] bg-white p-5 shadow-sm"
    >

      <div className="flex items-start justify-between gap-4">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            accentClasses[accent] || accentClasses.lavender
          }`}
        >
          {icon}
        </div>

        <span className="text-2xl font-bold text-[#292632]">
          {value}
        </span>

      </div>

      <h3 className="mt-5 text-lg font-bold text-[#292632]">
        {label}
      </h3>

      <p className="mt-1 text-sm leading-5 text-[#5F5964]">
        {description}
      </p>

    </Link>
  );
}

function SecondaryStat({
  icon,
  label,
  value,
  description,
  status = false,
}) {
  return (
    <div className="rounded-2xl border border-[#E0D8E4] bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEE9F3] text-[#735F87]">
          {icon}
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <span className="text-lg font-bold text-[#292632]">
              {value}
            </span>

            {status && value === "UP" && (
              <span className="rounded-full bg-[#EEF6F0] px-2.5 py-1 text-[11px] font-bold text-[#55745D]">
                Healthy
              </span>
            )}

          </div>

          <h3 className="mt-0.5 text-sm font-bold text-[#292632]">
            {label}
          </h3>

        </div>

      </div>

      <p className="mt-4 text-sm leading-5 text-[#5F5964]">
        {description}
      </p>

    </div>
  );
}

function AuditRow({ log }) {
  const action = log?.action || "SYSTEM_EVENT";
  const resourceType = log?.resourceType || "SYSTEM";
  const resourceId = log?.resourceId || "—";

  return (
    <div className="px-5 py-5 sm:px-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex min-w-0 gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEE9F3] text-[#735F87]">
            <History size={18} />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full bg-[#F0EBF4] px-2.5 py-1 text-xs font-bold text-[#604E70]">
                {action}
              </span>

              <span className="text-xs font-medium uppercase tracking-wide text-[#817A85]">
                {resourceType}
              </span>

            </div>

            <p className="mt-2 text-sm font-semibold text-[#292632]">
              {log?.details || `${action} recorded for ${resourceId}`}
            </p>

            {resourceId !== "—" && (
              <p className="mt-1 text-xs text-[#5F5964]">
                Resource: {resourceId}
              </p>
            )}

          </div>

        </div>

        <div className="shrink-0 text-left sm:text-right">

          <p className="text-xs font-bold text-[#4F4755]">
            User ID: {log?.userId ?? "—"}
          </p>

          <p className="mt-1 text-xs text-[#6A636D]">
            {formatDateTime(log?.createdAt)}
          </p>

          {log?.ipAddress && (
            <p className="mt-1 text-[11px] text-[#817A85]">
              IP: {log?.ipAddress}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

function EmptyAuditState() {
  return (
    <div className="px-6 py-14 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE9F3] text-[#735F87]">
        <History size={25} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#292632]">
        No audit events yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5F5964]">
        Security and workflow activity will appear here as actions are
        performed.
      </p>

    </div>
  );
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}