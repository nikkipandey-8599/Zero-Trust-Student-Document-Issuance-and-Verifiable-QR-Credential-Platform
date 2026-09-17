import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { CheckCircle, XCircle, ArrowLeft, Loader2, FileText } from "lucide-react";
import api from "../services/api";

export default function ReviewRequest() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [action, setAction]           = useState(null); // "approve" | "reject"
  const [rejectionReason, setReason]  = useState("");
  const [error, setError]             = useState("");

  const { data: req, isLoading } = useQuery(
    ["request", requestId],
    () => api.get(`/requests/${requestId}`).then((r) => r.data)
  );

  const { mutateAsync: decide, isLoading: deciding } = useMutation(
    (payload) => api.post(`/requests/${requestId}/decide`, payload).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("staff-requests");
        navigate("/staff");
      },
      onError: () => setError("Action failed. Please try again."),
    }
  );

  const handleDecide = async () => {
    if (action === "reject" && !rejectionReason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    setError("");
    await decide({
      action,
      rejection_reason: action === "reject" ? rejectionReason : null,
    });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
      <Loader2 size={24} className="spinning mr-2" /> Loading request…
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-7 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate("/staff")} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-semibold text-gray-900">Review Request</h1>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Request details */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText size={18} strokeWidth={1.4} className="text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {req?.doc_type?.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
              </p>
              <p className="text-xs text-gray-400">Request #{req?.id?.slice(0,8).toUpperCase()}</p>
            </div>
          </div>

          {[
            ["Student name",   req?.student_name],
            ["Roll no",        req?.roll_no],
            ["Course / Year",  `${req?.course} · Year ${req?.year}`],
            ["Purpose",        req?.purpose],
            ["Submitted on",   req?.created_at ? new Date(req.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "—"],
            ["Remarks",        req?.remarks || "None"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0 gap-4">
              <span className="text-xs text-gray-400 font-medium min-w-[130px]">{k}</span>
              <span className="text-sm text-gray-800 font-medium text-right">{v}</span>
            </div>
          ))}
        </div>

        {/* Action selection */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Decision</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setAction("approve"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all
                ${action === "approve"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500 hover:border-green-300"}`}
            >
              <CheckCircle size={16} /> Approve
            </button>
            <button
              onClick={() => { setAction("reject"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all
                ${action === "reject"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 text-gray-500 hover:border-red-300"}`}
            >
              <XCircle size={16} /> Reject
            </button>
          </div>

          {action === "reject" && (
            <div className="mt-4">
              <label className="text-xs font-semibold text-gray-600 block mb-2">
                Reason for rejection <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this request is being rejected…"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none"
              />
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
        </div>

        <button
          onClick={handleDecide}
          disabled={!action || deciding}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors
            ${!action ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
              action === "approve" ? "bg-green-600 hover:bg-green-700 text-white" :
              "bg-red-600 hover:bg-red-700 text-white"}`}
        >
          {deciding
            ? <><Loader2 size={15} className="spinning" /> Processing…</>
            : action === "approve" ? "Approve & Generate Document"
            : action === "reject"  ? "Reject Request"
            : "Select a decision above"}
        </button>
      </div>
    </div>
  );
}