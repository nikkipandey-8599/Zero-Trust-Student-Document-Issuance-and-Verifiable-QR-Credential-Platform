import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Loader2,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
  UNDER_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ISSUED: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function StudentRequests() {
  const { user } = useAuth();

  const [documentTypes, setDocumentTypes] = useState([]);
  const [requests, setRequests] = useState([]);

  const [documentTypeId, setDocumentTypeId] = useState("");
  const [purpose, setPurpose] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const studentId = user?.id ?? user?.userId;

const loadData = async () => {
  try {
    setLoading(true);
    setError("");

    // Document types are public, so load them independently.
    const typesResponse = await api.get("/documents/types");

    console.log("DOCUMENT TYPES:", typesResponse.data);

    setDocumentTypes(
      Array.isArray(typesResponse.data)
        ? typesResponse.data
        : []
    );

    // Student request history needs the student ID.
    if (studentId) {
      try {
        const requestsResponse = await api.get(
          `/requests/student/${studentId}`
        );

        console.log("MY REQUESTS:", requestsResponse.data);

        setRequests(
          Array.isArray(requestsResponse.data)
            ? requestsResponse.data
            : []
        );
      } catch (requestError) {
        console.error(
          "REQUESTS API ERROR:",
          requestError
        );

        setRequests([]);
      }
    } else {
      console.warn("Student ID not found in logged-in user:", user);
      setRequests([]);
    }

  } catch (err) {
    console.error("DOCUMENT TYPES ERROR:", err);

    setError(
      "Unable to load document services. Make sure the backend is running."
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadData();
}, [studentId]);

  const submitRequest = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!documentTypeId || !purpose.trim()) {
      setError("Please select a document and enter the purpose.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(`/requests/student/${studentId}`, {
        documentTypeId: Number(documentTypeId),
        purpose: purpose.trim(),
      });

      setSuccess("Document request submitted successfully.");
      setDocumentTypeId("");
      setPurpose("");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to submit the request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "APPROVED" || status === "ISSUED") {
      return <CheckCircle size={18} />;
    }

    if (status === "REJECTED") {
      return <XCircle size={18} />;
    }

    return <Clock size={18} />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-8">

        <Link
          to="/student"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Student Portal
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600">
            Document Services
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Request a Document
          </h1>

          <p className="mt-2 text-slate-500">
            Submit an official academic document request and track its status.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">

          {/* Request Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FileText size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  New Request
                </h2>
                <p className="text-sm text-slate-500">
                  Choose your document
                </p>
              </div>
            </div>

            <form onSubmit={submitRequest} className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Document Type
                </label>

                <select
                  value={documentTypeId}
                  onChange={(e) => setDocumentTypeId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select document</option>

                  {documentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Purpose
                </label>

                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={5}
                  placeholder="Example: Required for internship verification..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Eligibility checklist
                </p>

                <div className="mt-3 space-y-2 text-sm text-slate-500">
                  <p>✓ Student account verified</p>
                  <p>✓ Official academic record available</p>
                  <p>✓ Request will be reviewed by staff</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Requests */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                My Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track your submitted document requests.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2
                  size={28}
                  className="animate-spin text-indigo-600"
                />
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                <FileText
                  className="mx-auto mb-3 text-slate-400"
                  size={36}
                />

                <p className="font-semibold text-slate-700">
                  No requests yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Submit your first document request.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-indigo-200"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">

                      <div>
                        <p className="font-bold text-slate-900">
                          {request.documentType?.name || "Academic Document"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Request #{request.id}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                          statusStyles[request.status] ||
                          "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Purpose
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {request.purpose}
                      </p>
                    </div>

                    {request.rejectionReason && (
                      <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        <strong>Rejection reason:</strong>{" "}
                        {request.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}