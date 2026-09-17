import { Link } from "react-router-dom";
import { FileText, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

/**
 * RequestTable
 * Props:
 *   requests  — array of request objects
 *   showStudent — boolean, show student name column (for staff view)
 *   linkTo    — function(req) => path string, where the row arrow links to
 */
export default function RequestTable({
  requests = [],
  showStudent = false,
  linkTo = () => "/track",
}) {
  if (!requests.length) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {showStudent && (
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                Student
              </th>
            )}
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
              Document
            </th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
              Purpose
            </th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
              Date
            </th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
              Status
            </th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr
              key={req.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
            >
              {showStudent && (
                <td className="px-5 py-3.5 font-medium text-gray-900">
                  {req.student_name ?? "—"}
                </td>
              )}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <FileText
                    size={14}
                    strokeWidth={1.4}
                    className="text-blue-400 flex-shrink-0"
                  />
                  {req.doc_type
                    ?.replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "—"}
                </div>
              </td>
              <td className="px-5 py-3.5 text-gray-400 text-xs">
                {req.purpose ?? "—"}
              </td>
              <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                {req.created_at
                  ? new Date(req.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge status={req.status} />
              </td>
              <td className="px-5 py-3.5">
                <Link
                  to={linkTo(req)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-blue-500 transition-colors"
                  aria-label="View request"
                >
                  <ChevronRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}