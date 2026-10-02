import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const statusConfig = {
  SUBMITTED: {
    label: "Submitted",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Send size={14} />,
  },

  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock3 size={14} />,
  },

  APPROVED: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={14} />,
  },

  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle size={14} />,
  },

  DOCUMENT_GENERATED: {
    label: "Document Ready",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <CheckCircle2 size={14} />,
  },

  ISSUED: {
    label: "Issued",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <CheckCircle2 size={14} />,
  },

  REVOKED: {
    label: "Revoked",
    className: "bg-slate-100 text-slate-700 border-slate-300",
    icon: <XCircle size={14} />,
  },
};

export default function StudentRequests() {
  const { user } = useAuth();

  const studentId = user?.id ?? user?.userId;

  const [documentTypes, setDocumentTypes] = useState([]);
  const [requests, setRequests] = useState([]);

  const [documentTypeId, setDocumentTypeId] = useState("");
  const [purpose, setPurpose] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.updatedAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.updatedAt || 0
      ).getTime();

      return dateB - dateA;
    });
  }, [requests]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const typesResponse = await api.get("/documents/types");

      setDocumentTypes(
        Array.isArray(typesResponse.data)
          ? typesResponse.data
          : []
      );

      if (!studentId) {
        setRequests([]);
        return;
      }

      const requestsResponse = await api.get(
        `/requests/student/${studentId}`
      );

      setRequests(
        Array.isArray(requestsResponse.data)
          ? requestsResponse.data
          : []
      );
    } catch (err) {
      console.error("Failed to load student requests:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load your requests. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!documentTypeId) {
      setError("Please select a document type.");
      return;
    }

    if (!purpose.trim()) {
      setError("Please enter the purpose of your request.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(`/requests/student/${studentId}`, {
        documentTypeId: Number(documentTypeId),
        purpose: purpose.trim(),
      });

      setDocumentTypeId("");
      setPurpose("");

      setSuccess(
        "Your document request has been submitted successfully."
      );

      await loadData();
    } catch (err) {
      console.error("Failed to submit request:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to submit your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/student"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#65566F] transition hover:text-[#493A54] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* Page Header */}
        <section className="mt-5">

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A668E]">
            Student services
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#292632] sm:text-4xl">
            Document requests
          </h1>

          <p className="mt-2 max-w-2xl text-base leading-6 text-[#5F5964]">
            Request an official academic document and track its progress
            through the VerifyID workflow.
          </p>

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

        {/* Request Form */}
        <section className="mt-7 rounded-[22px] border border-[#E0D8E4] bg-white p-6 shadow-sm sm:p-7">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEE9F3] text-[#735F87]">
              <FileText size={23} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A668E]">
                New request
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#292632]">
                Request an official document
              </h2>

              <p className="mt-1 text-sm leading-5 text-[#5F5964]">
                Select the document you need and tell the institution why you
                require it.
              </p>
            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7"
          >

            <div className="grid gap-6 lg:grid-cols-2">

              {/* Document type */}
              <div>

                <label
                  htmlFor="documentType"
                  className="block text-sm font-bold text-[#292632]"
                >
                  Document type
                </label>

                <select
                  id="documentType"
                  value={documentTypeId}
                  onChange={(event) =>
                    setDocumentTypeId(event.target.value)
                  }
                  disabled={loading || submitting}
                  className="mt-2 h-12 w-full rounded-xl border border-[#CEC4D5] bg-white px-4 text-sm font-medium text-[#292632] shadow-sm transition focus:border-[#8E7AA8] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8]/20 disabled:cursor-not-allowed disabled:bg-[#F5F2F6]"
                >
                  <option value="">
                    Select a document
                  </option>

                  {documentTypes.map((type) => (
                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-[#5F5964]">
                  Choose the official document you need.
                </p>

              </div>

              {/* Purpose */}
              <div>

                <label
                  htmlFor="purpose"
                  className="block text-sm font-bold text-[#292632]"
                >
                  Purpose
                </label>

                <input
                  id="purpose"
                  type="text"
                  value={purpose}
                  onChange={(event) =>
                    setPurpose(event.target.value)
                  }
                  disabled={submitting}
                  placeholder="Example: Internship application"
                  className="mt-2 h-12 w-full rounded-xl border border-[#CEC4D5] bg-white px-4 text-sm font-medium text-[#292632] shadow-sm placeholder:text-[#817A85] focus:border-[#8E7AA8] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8]/20 disabled:cursor-not-allowed disabled:bg-[#F5F2F6]"
                />

                <p className="mt-2 text-xs text-[#5F5964]">
                  Briefly explain why you need this document.
                </p>

              </div>

            </div>

            <div className="mt-6 flex justify-end">

              <button
                type="submit"
                disabled={submitting || loading || !studentId}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#8E7AA8] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit request
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

            </div>

          </form>

        </section>

        {/* Request History */}
        <section className="mt-9">

          <div className="mb-4">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A668E]">
              Request history
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#292632]">
              Your requests
            </h2>

            <p className="mt-1 text-sm text-[#5F5964]">
              Track the current status of your submitted documents.
            </p>

          </div>

          <div className="overflow-hidden rounded-[22px] border border-[#E0D8E4] bg-white shadow-sm">

            {loading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-14 text-sm font-medium text-[#5F5964]">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Loading your requests...
              </div>
            ) : sortedRequests.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">

                  <table className="w-full min-w-[760px]">

                    <thead className="border-b border-[#E5DEE8] bg-[#FBF9FC]">

                      <tr>

                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Document
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Purpose
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Date requested
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-bold text-[#4C4552]">
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {sortedRequests.map((request) => (
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

                  {sortedRequests.map((request) => (
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

function RequestRow({ request }) {
  const status = getStatus(request.status);

  return (
    <tr className="border-b border-[#EAE4ED] last:border-0">

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

      <td className="max-w-[260px] px-6 py-5 text-sm font-medium text-[#5F5964]">
        <span className="line-clamp-2">
          {request.purpose || "—"}
        </span>
      </td>

      <td className="px-6 py-5 text-sm font-medium text-[#5F5964]">
        {formatDate(
          request.createdAt ||
            request.updatedAt
        )}
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={request.status} />
      </td>

    </tr>
  );
}

function RequestMobileCard({ request }) {
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

            <p className="mt-1 text-xs font-medium text-[#5F5964]">
              {formatDate(
                request.createdAt ||
                  request.updatedAt
              )}
            </p>

          </div>

        </div>

        <StatusBadge status={request.status} />

      </div>

      <div className="mt-4 rounded-xl bg-[#FAF8FB] p-3">

        <p className="text-xs font-bold uppercase tracking-wide text-[#7A668E]">
          Purpose
        </p>

        <p className="mt-1 text-sm leading-5 text-[#4F4755]">
          {request.purpose || "No purpose provided"}
        </p>

      </div>

    </div>
  );
}

function StatusBadge({ status }) {
  const config = getStatus(status);

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE9F3] text-[#735F87]">
        <FileText size={25} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#292632]">
        No requests yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5F5964]">
        Submit your first document request using the form above. Your request
        status will appear here once submitted.
      </p>

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

function getStatus(status) {
  return (
    statusConfig[status] || {
      label: status || "Unknown",
      className:
        "bg-slate-100 text-slate-700 border-slate-300",
      icon: <Clock3 size={14} />,
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