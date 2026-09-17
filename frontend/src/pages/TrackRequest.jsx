import { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Download, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import { useRequests } from "../hooks/useRequests";

const statusSteps = {
  pending:  ["Submitted", "Under Review", "Awaiting Approval"],
  approved: ["Submitted", "Under Review", "Approved"],
  rejected: ["Submitted", "Under Review", "Rejected"],
  issued:   ["Submitted", "Under Review", "Approved", "Issued"],
};

function Timeline({ status }) {
  const steps = statusSteps[status] ?? statusSteps.pending;
  const activeIdx = steps.length - 1;

  return (
    <div className="flex items-start gap-0 mt-4">
      {steps.map((step, i) => {
        const isDone    = i < activeIdx;
        const isActive  = i === activeIdx;
        const isReject  = status === "rejected" && isActive;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                ${isReject  ? "bg-red-100 text-red-600" :
                  isDone || isActive ? "bg-green-100 text-green-600" :
                  "bg-gray-100 text-gray-400"}`}>
                {isReject ? <XCircle size={14} /> :
                 isDone || isActive ? <CheckCircle size={14} /> : i + 1}
              </div>
              <p className={`text-[11px] mt-1 text-center whitespace-nowrap font-medium
                ${isReject ? "text-red-500" :
                  isActive ? "text-gray-800" :
                  isDone ? "text-green-600" : "text-gray-400"}`}>
                {step}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-[1.5px] mb-4 mx-1
                ${i < activeIdx ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function RequestRow({ req }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3 bg-white">
      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FileText size={16} strokeWidth={1.5} className="text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-600 text-gray-900 truncate">{req.doc_type?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            #{req.id?.slice(0, 8).toUpperCase()} · {new Date(req.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <StatusBadge status={req.status} />
        <div className="text-gray-400 ml-2">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded details */}
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <Timeline status={req.status} />

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Purpose</p>
              <p className="text-sm text-gray-700">{req.purpose}</p>
            </div>
            {req.remarks && (
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Remarks</p>
                <p className="text-sm text-gray-700">{req.remarks}</p>
              </div>
            )}
            {req.rejection_reason && (
              <div className="col-span-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <p className="text-[11px] text-red-400 uppercase tracking-wide font-semibold mb-1">Rejection reason</p>
                <p className="text-sm text-red-700">{req.rejection_reason}</p>
              </div>
            )}
          </div>

          {req.status === "issued" && req.document_url && (
            <a
              href={req.document_url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={14} /> Download document
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackRequest() {
  const { data: requests, isLoading, isError } = useRequests();
  const [filter, setFilter] = useState("all");

  const filters = ["all", "pending", "approved", "issued", "rejected"];
  const filtered = filter === "all"
    ? requests
    : requests?.filter((r) => r.status === filter);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar title="Track Requests" />
        <div className="max-w-4xl mx-auto w-full px-7 py-8">

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize
                  ${filter === f
                    ? "bg-brand-500 border-brand-500 text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500"}`}
              >
                {f === "all" ? "All requests" : f}
                {f !== "all" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({requests?.filter((r) => r.status === f).length ?? 0})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 size={24} className="spinning mr-2" /> Loading requests…
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="text-center py-20 text-red-400">
              Could not load requests. Please refresh.
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && filtered?.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Clock size={36} strokeWidth={1.2} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-500">No {filter !== "all" ? filter : ""} requests found</p>
            </div>
          )}

          {/* Request rows */}
          {!isLoading && filtered?.map((req) => (
            <RequestRow key={req.id} req={req} />
          ))}

        </div>
      </div>
    </div>
  );
}