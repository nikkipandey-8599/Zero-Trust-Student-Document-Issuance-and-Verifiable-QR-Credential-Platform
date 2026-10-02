import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const statusConfig = {
  SUBMITTED: {
    label: "Submitted",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  DOCUMENT_GENERATED: {
    label: "Document Ready",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  ISSUED: {
    label: "Issued",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  REVOKED: {
    label: "Revoked",
    className: "bg-slate-100 text-slate-700 border-slate-300",
  },
};

export default function StudentDashboard() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = user?.id ?? user?.userId;

  const firstName = useMemo(() => {
    const name = user?.fullName || "Student";
    return name.trim().split(/\s+/)[0];
  }, [user?.fullName]);

  useEffect(() => {
    const loadRequests = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await api.get(
          `/requests/student/${studentId}`
        );

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        const sorted = [...data].sort((a, b) => {
          const dateA = new Date(
            a.createdAt || a.updatedAt || 0
          ).getTime();

          const dateB = new Date(
            b.createdAt || b.updatedAt || 0
          ).getTime();

          return dateB - dateA;
        });

        setRequests(sorted);
      } catch (error) {
        console.error("Failed to load student requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [studentId]);

  const pendingCount = requests.filter((request) =>
    ["SUBMITTED", "UNDER_REVIEW"].includes(request.status)
  ).length;

  const readyCount = requests.filter((request) =>
    ["ISSUED", "DOCUMENT_GENERATED"].includes(request.status)
  ).length;

  const latestRequest = requests[0] || null;

  const latestDocumentName = latestRequest
    ? getDocumentName(latestRequest)
    : "No requests yet";

  const latestStatus = latestRequest?.status
    ? getStatusConfig(latestRequest.status)
    : null;

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        {/* Compact Hero */}
        <section className="rounded-[24px] border border-[#DDD5E4] bg-[#EEE9F3] px-6 py-7 shadow-sm sm:px-8">

          <div className="grid gap-6 lg:grid-cols-[1fr_330px] lg:items-center">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#CFC3D9] bg-white px-3 py-1.5 text-xs font-semibold text-[#675575]">
                <ShieldCheck size={14} />
                Student Portal
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#292632] sm:text-4xl">
                Welcome back, {firstName}
              </h1>

              <p className="mt-2 max-w-2xl text-base leading-6 text-[#5F5964]">
                Request, track and verify your official academic documents
                through one secure platform.
              </p>

              <div className="mt-6">
                <Link
                  to="/student/requests/new"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#8E7AA8] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
                >
                  Request a document
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            {/* Latest request */}
            <div className="rounded-2xl border border-[#D5CBDD] bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A668E]">
                  Latest request
                </p>

                <Clock3 size={18} className="text-[#8E7AA8]" />
              </div>

              {loading ? (
                <div className="mt-5 flex items-center gap-2 text-sm text-[#5F5964]">
                  <Loader2 size={16} className="animate-spin" />
                  Loading request...
                </div>
              ) : latestRequest ? (
                <>
                  <h2 className="mt-4 text-lg font-bold text-[#292632]">
                    {latestDocumentName}
                  </h2>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-bold ${latestStatus.className}`}
                    >
                      {latestStatus.label}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-[#5F5964]">
                    Requested{" "}
                    {formatDate(
                      latestRequest.createdAt ||
                        latestRequest.updatedAt
                    )}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-lg font-bold text-[#292632]">
                    No requests yet
                  </h2>

                  <p className="mt-2 text-sm leading-5 text-[#5F5964]">
                    Your latest document request will appear here.
                  </p>
                </>
              )}
            </div>

          </div>
        </section>

        {/* Real Stats */}
        <section className="mt-8">

          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A668E]">
              Account activity
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#292632]">
              Your document activity
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <StatCard
              icon={<Clock3 size={21} />}
              label="Pending requests"
              value={loading ? "—" : pendingCount}
              description={
                pendingCount === 1
                  ? "Request currently being processed"
                  : "Requests currently being processed"
              }
            />

            <StatCard
              icon={<Download size={21} />}
              label="Ready to download"
              value={loading ? "—" : readyCount}
              description={
                readyCount === 1
                  ? "Credential ready"
                  : "Credentials ready"
              }
            />

            <StatCard
              icon={<FileText size={21} />}
              label="Last request"
              value={
                loading
                  ? "—"
                  : latestRequest
                    ? latestDocumentName
                    : "None"
              }
              description={
                latestRequest
                  ? getStatusConfig(latestRequest.status).label
                  : "No request submitted"
              }
            />

          </div>
        </section>

        {/* Recent Requests */}
        <section className="mt-8">

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A668E]">
                Request history
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#292632]">
                Recent requests
              </h2>
            </div>

            <Link
              to="/student/requests/new"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#735F87] hover:text-[#574669] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
            >
              View all requests
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="overflow-hidden rounded-[22px] border border-[#E0D8E4] bg-white shadow-sm">

            {loading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-[#5F5964]">
                <Loader2 size={18} className="animate-spin" />
                Loading your requests...
              </div>
            ) : requests.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[720px]">
                    <thead className="border-b border-[#E5DEE8] bg-[#FBF9FC]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Document type
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Date requested
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right text-sm font-bold text-[#4C4552]">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {requests.slice(0, 8).map((request) => (
                        <RequestRow
                          key={request.id}
                          request={request}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="divide-y divide-[#E5DEE8] md:hidden">
                  {requests.slice(0, 8).map((request) => (
                    <RequestMobileCard
                      key={request.id}
                      request={request}
                    />
                  ))}
                </div>
              </>
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
}) {
  return (
    <div className="rounded-2xl border border-[#E0D8E4] bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEE9F3] text-[#735F87]">
          {icon}
        </div>

        <p className="max-w-[190px] text-right text-lg font-bold leading-6 text-[#292632]">
          {value}
        </p>

      </div>

      <h3 className="mt-5 text-lg font-bold text-[#292632]">
        {label}
      </h3>

      <p className="mt-1 text-sm leading-5 text-[#5F5964]">
        {description}
      </p>

    </div>
  );
}

function RequestRow({ request }) {
  const status = getStatusConfig(request.status);
  const credentialId =
    request?.credential?.credentialId ||
    request?.credentialId ||
    null;

  return (
    <tr className="border-b border-[#EAE4ED] last:border-0">

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EBF4] text-[#735F87]">
            <FileText size={18} />
          </div>

          <span className="text-base font-bold text-[#292632]">
            {getDocumentName(request)}
          </span>
        </div>
      </td>

      <td className="px-6 py-5 text-sm font-medium text-[#5F5964]">
        {formatDate(request.createdAt || request.updatedAt)}
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
        >
          {status.label}
        </span>
      </td>

      <td className="px-6 py-5 text-right">
        {credentialId ? (
          <Link
            to={`/credential/${credentialId}`}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#CFC3D9] bg-white px-3.5 text-sm font-bold text-[#604E70] transition hover:bg-[#F1ECF4] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
          >
            <Download size={15} />
            Download
          </Link>
        ) : (
          <Link
            to="/student/requests/new"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#CFC3D9] bg-white px-3.5 text-sm font-bold text-[#604E70] transition hover:bg-[#F1ECF4] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
          >
            View
            <ArrowRight size={15} />
          </Link>
        )}
      </td>

    </tr>
  );
}

function RequestMobileCard({ request }) {
  const status = getStatusConfig(request.status);

  const credentialId =
    request?.credential?.credentialId ||
    request?.credentialId ||
    null;

  return (
    <div className="p-5">

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EBF4] text-[#735F87]">
            <FileText size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-[#292632]">
              {getDocumentName(request)}
            </h3>

            <p className="mt-1 text-sm text-[#5F5964]">
              {formatDate(request.createdAt || request.updatedAt)}
            </p>
          </div>

        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${status.className}`}
        >
          {status.label}
        </span>

      </div>

      <div className="mt-4">

        {credentialId ? (
          <Link
            to={`/credential/${credentialId}`}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8E7AA8] px-4 text-sm font-bold text-white transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
          >
            <Download size={15} />
            Download credential
          </Link>
        ) : (
          <Link
            to="/student/requests/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#CFC3D9] bg-white px-4 text-sm font-bold text-[#604E70] transition hover:bg-[#F1ECF4] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
          >
            View request
            <ArrowRight size={15} />
          </Link>
        )}

      </div>

    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE9F3] text-[#735F87]">
        <FileText size={25} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#292632]">
        No document requests yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5F5964]">
        When you submit an official document request, it will appear here so
        you can track its status.
      </p>

      <Link
        to="/student/requests/new"
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#8E7AA8] px-5 text-sm font-bold text-white transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
      >
        Request a document
        <ArrowRight size={16} />
      </Link>

    </div>
  );
}

function getDocumentName(request) {
  return (
    request?.documentType?.name ||
    request?.documentTypeName ||
    request?.documentName ||
    "Official document"
  );
}

function getStatusConfig(status) {
  return (
    statusConfig[status] || {
      label: status || "Unknown",
      className: "bg-slate-100 text-slate-700 border-slate-300",
    }
  );
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}