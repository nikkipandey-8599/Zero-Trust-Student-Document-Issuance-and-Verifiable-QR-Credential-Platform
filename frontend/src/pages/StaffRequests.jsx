import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

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

  ISSUED: {
    label: "Issued",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

export default function StaffRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        pendingResponse,
        approvedResponse,
      ] = await Promise.all([
        api.get("/staff/requests/pending"),
        api.get("/staff/requests/approved"),
      ]);

      const pending = Array.isArray(pendingResponse.data)
        ? pendingResponse.data
        : [];

      const approved = Array.isArray(approvedResponse.data)
        ? approvedResponse.data
        : [];

      const combined = [...pending, ...approved];

      combined.sort((a, b) => {
        const dateA = new Date(
          a.createdAt || a.updatedAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || b.updatedAt || 0
        ).getTime();

        return dateB - dateA;
      });

      setRequests(combined);
    } catch (err) {
      console.error("Failed to load staff requests:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load requests. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      setActionId(id);
      setError("");
      setSuccess("");

      await api.post(`/staff/requests/${id}/approve`);

      setSuccess("The document request has been approved.");

      await loadRequests();
    } catch (err) {
      console.error("Failed to approve request:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to approve this request."
      );
    } finally {
      setActionId(null);
    }
  };

  const rejectRequest = async (id) => {
    const reason = window.prompt(
      "Enter the reason for rejecting this request:"
    );

    if (!reason || !reason.trim()) {
      return;
    }

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      await api.post(
        `/staff/requests/${id}/reject`,
        null,
        {
          params: {
            reason: reason.trim(),
          },
        }
      );

      setSuccess("The document request has been rejected.");

      await loadRequests();
    } catch (err) {
      console.error("Failed to reject request:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to reject this request."
      );
    } finally {
      setActionId(null);
    }
  };

  const issueCredential = async (id) => {
    try {
      setActionId(id);
      setError("");
      setSuccess("");

      const response = await api.post(
        `/staff/requests/${id}/issue`
      );

      const credential = response.data;

      if (credential?.credentialId) {
        navigate(`/credential/${credential.credentialId}`);
        return;
      }

      setSuccess("Credential issued successfully.");

      await loadRequests();
    } catch (err) {
      console.error("Failed to issue credential:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to issue the credential."
      );
    } finally {
      setActionId(null);
    }
  };

  const pendingCount = requests.filter(
    (request) =>
      request.status === "SUBMITTED" ||
      request.status === "UNDER_REVIEW"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "APPROVED"
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/staff"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#65566F] transition hover:text-[#493A54] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* Header */}
        <section className="mt-5">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A668E]">
                Staff operations
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#292632] sm:text-4xl">
                Document requests
              </h1>

              <p className="mt-2 max-w-2xl text-base leading-6 text-[#5F5964]">
                Review student requests, make approval decisions and issue
                digitally verifiable credentials.
              </p>

            </div>

            <button
              type="button"
              onClick={() => loadRequests(true)}
              disabled={refreshing}
              className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-[#CFC3D9] bg-white px-4 text-sm font-bold text-[#594B68] shadow-sm transition hover:bg-[#F1ECF4] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

        </section>

        {/* Alerts */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        {/* Summary */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <SummaryCard
            icon={<FileText size={21} />}
            label="Requests awaiting review"
            value={loading ? "—" : pendingCount}
            description="Submitted or under review"
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Ready for issuance"
            value={loading ? "—" : approvedCount}
            description="Approved requests"
          />

          <SummaryCard
            icon={<ShieldCheck size={21} />}
            label="Workflow"
            value="Active"
            description="Approval and credential issuance"
          />

        </section>

        {/* Requests */}
        <section className="mt-8">

          <div className="mb-4">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A668E]">
              Review queue
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#292632]">
              Student requests
            </h2>

            <p className="mt-1 text-sm text-[#5F5964]">
              Approve, reject or issue credentials for eligible requests.
            </p>

          </div>

          <div className="overflow-hidden rounded-[22px] border border-[#E0D8E4] bg-white shadow-sm">

            {loading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-14 text-sm font-medium text-[#5F5964]">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Loading student requests...
              </div>
            ) : requests.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">

                  <table className="w-full min-w-[950px]">

                    <thead className="border-b border-[#E5DEE8] bg-[#FBF9FC]">

                      <tr>

                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Student
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Document
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Purpose
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

                      {requests.map((request) => (
                        <RequestRow
                          key={request.id}
                          request={request}
                          actionId={actionId}
                          onApprove={approveRequest}
                          onReject={rejectRequest}
                          onIssue={issueCredential}
                        />
                      ))}

                    </tbody>

                  </table>

                </div>

                {/* Mobile */}
                <div className="divide-y divide-[#E5DEE8] md:hidden">

                  {requests.map((request) => (
                    <RequestMobileCard
                      key={request.id}
                      request={request}
                      actionId={actionId}
                      onApprove={approveRequest}
                      onReject={rejectRequest}
                      onIssue={issueCredential}
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

function SummaryCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-[#E0D8E4] bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE9F3] text-[#735F87]">
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

    </div>
  );
}

function RequestRow({
  request,
  actionId,
  onApprove,
  onReject,
  onIssue,
}) {
  const isProcessing = actionId === request.id;

  return (
    <tr className="border-b border-[#EAE4ED] last:border-0">

      <td className="px-6 py-5">

        <div>
          <p className="text-base font-bold text-[#292632]">
            {getStudentName(request)}
          </p>

          <p className="mt-1 text-xs text-[#5F5964]">
            {getStudentEmail(request)}
          </p>
        </div>

      </td>

      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EBF4] text-[#735F87]">
            <FileText size={18} />
          </div>

          <span className="text-base font-bold text-[#292632]">
            {getDocumentName(request)}
          </span>

        </div>

      </td>

      <td className="max-w-[240px] px-6 py-5 text-sm font-medium text-[#5F5964]">
        <span className="line-clamp-2">
          {request.purpose || "—"}
        </span>
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={request.status} />
      </td>

      <td className="px-6 py-5">

        <ActionButtons
          request={request}
          isProcessing={isProcessing}
          onApprove={onApprove}
          onReject={onReject}
          onIssue={onIssue}
        />

      </td>

    </tr>
  );
}

function RequestMobileCard({
  request,
  actionId,
  onApprove,
  onReject,
  onIssue,
}) {
  const isProcessing = actionId === request.id;

  return (
    <div className="p-5">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <h3 className="text-lg font-bold text-[#292632]">
            {getStudentName(request)}
          </h3>

          <p className="mt-1 text-xs text-[#5F5964]">
            {getStudentEmail(request)}
          </p>

        </div>

        <StatusBadge status={request.status} />

      </div>

      <div className="mt-4 rounded-xl bg-[#FAF8FB] p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEE9F3] text-[#735F87]">
            <FileText size={18} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#7A668E]">
              Document
            </p>

            <p className="mt-1 text-base font-bold text-[#292632]">
              {getDocumentName(request)}
            </p>
          </div>

        </div>

        <div className="mt-4">

          <p className="text-xs font-bold uppercase tracking-wide text-[#7A668E]">
            Purpose
          </p>

          <p className="mt-1 text-sm leading-5 text-[#4F4755]">
            {request.purpose || "No purpose provided"}
          </p>

        </div>

      </div>

      <div className="mt-4">

        <ActionButtons
          request={request}
          isProcessing={isProcessing}
          onApprove={onApprove}
          onReject={onReject}
          onIssue={onIssue}
          mobile
        />

      </div>

    </div>
  );
}

function ActionButtons({
  request,
  isProcessing,
  onApprove,
  onReject,
  onIssue,
  mobile = false,
}) {
  if (isProcessing) {
    return (
      <div
        className={`flex items-center gap-2 text-sm font-bold text-[#735F87] ${
          mobile ? "justify-center" : "justify-end"
        }`}
      >
        <Loader2
          size={17}
          className="animate-spin"
        />
        Processing...
      </div>
    );
  }

  if (
    request.status === "SUBMITTED" ||
    request.status === "UNDER_REVIEW"
  ) {
    return (
      <div
        className={`flex gap-2 ${
          mobile
            ? "w-full flex-col"
            : "justify-end"
        }`}
      >

        <button
          type="button"
          onClick={() => onApprove(request.id)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#6F9276] px-4 text-sm font-bold text-white transition hover:bg-[#5E8065] focus:outline-none focus:ring-2 focus:ring-[#6F9276] focus:ring-offset-2"
        >
          <CheckCircle2 size={16} />
          Approve
        </button>

        <button
          type="button"
          onClick={() => onReject(request.id)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-bold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
        >
          <XCircle size={16} />
          Reject
        </button>

      </div>
    );
  }

  if (request.status === "APPROVED") {
    return (
      <button
        type="button"
        onClick={() => onIssue(request.id)}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#8E7AA8] px-4 text-sm font-bold text-white transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2 ${
          mobile ? "w-full" : "ml-auto"
        }`}
      >
        <FileCheck2 size={16} />
        Issue credential
      </button>
    );
  }

  return (
    <span
      className={`text-sm font-semibold text-[#817A85] ${
        mobile ? "block text-center" : "block text-right"
      }`}
    >
      No action required
    </span>
  );
}

function StatusBadge({ status }) {
  const config =
    statusConfig[status] || {
      label: status || "Unknown",
      className:
        "bg-slate-100 text-slate-700 border-slate-300",
    };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE9F3] text-[#735F87]">
        <ShieldCheck size={25} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#292632]">
        No requests in the review queue
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5F5964]">
        New student document requests will appear here when they are
        submitted.
      </p>

    </div>
  );
}

function getStudentName(request) {
  return (
    request?.student?.fullName ||
    request?.studentName ||
    request?.fullName ||
    "Student"
  );
}

function getStudentEmail(request) {
  return (
    request?.student?.email ||
    request?.studentEmail ||
    request?.email ||
    "No email available"
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