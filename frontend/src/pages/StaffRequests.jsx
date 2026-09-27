import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

export default function StaffRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const loadRequests = async () => {
  try {
    setLoading(true);
    setError("");

    const [pendingResponse, approvedResponse] =
      await Promise.all([
        api.get("/staff/requests/pending"),
        api.get("/staff/requests/approved"),
      ]);

    const pending = Array.isArray(pendingResponse.data)
      ? pendingResponse.data
      : [];

    const approved = Array.isArray(approvedResponse.data)
      ? approvedResponse.data
      : [];

    setRequests([...pending, ...approved]);

  } catch (err) {
    console.error("STAFF REQUEST ERROR:", err);

    setError(
      err?.response?.data?.message ||
        "Unable to load student requests."
    );
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      setActionId(id);

      await api.post(`/staff/requests/${id}/approve`);

      await loadRequests();
    } catch (err) {
      console.error(err);

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

    if (!reason?.trim()) {
      return;
    }

    try {
      setActionId(id);

      await api.post(
        `/staff/requests/${id}/reject`,
        null,
        {
          params: {
            reason: reason.trim(),
          },
        }
      );

      await loadRequests();
    } catch (err) {
      console.error(err);

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

      const response = await api.post(
        `/staff/requests/${id}/issue`
      );

      const credential = response.data;

      if (credential?.credentialId) {
        window.location.href =
          `/credential/${credential.credentialId}`;
      } else {
        await loadRequests();
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to issue credential."
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-8">

        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/staff"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Staff Portal
          </Link>

          <button
            onClick={loadRequests}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600">
            Verification Operations
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Student Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Review submitted requests and issue trusted credentials.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-20">
            <Loader2
              size={32}
              className="animate-spin text-indigo-600"
            />
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <CheckCircle
              size={45}
              className="mx-auto mb-4 text-green-500"
            />

            <h2 className="text-xl font-bold text-slate-800">
              No pending requests
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              All submitted requests have been processed.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                  <div className="flex gap-4">

                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                      <FileText size={24} />
                    </div>

                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {request.documentType?.name ||
                          "Academic Document"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Request #{request.id}
                      </p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Student
                          </p>

                          <p className="mt-1 font-medium text-slate-800">
                            {request.student?.fullName ||
                              "Student"}
                          </p>

                          <p className="text-sm text-slate-500">
                            {request.student?.email || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Status
                          </p>

                          <span className="mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() => approveRequest(request.id)}
                      disabled={actionId === request.id}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle size={17} />
                      Approve
                    </button>

                    <button
                      onClick={() => rejectRequest(request.id)}
                      disabled={actionId === request.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Reject
                    </button>

                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Purpose
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {request.purpose}
                  </p>
                </div>

                {request.status === "APPROVED" && (
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 p-4">

                    <div className="flex items-center gap-3">
                      <ShieldCheck
                        size={22}
                        className="text-indigo-600"
                      />

                      <div>
                        <p className="font-semibold text-indigo-900">
                          Request approved
                        </p>

                        <p className="text-sm text-indigo-700">
                          Generate the digitally signed credential.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => issueCredential(request.id)}
                      disabled={actionId === request.id}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {actionId === request.id ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <ShieldCheck size={17} />
                      )}

                      Issue Credential
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}