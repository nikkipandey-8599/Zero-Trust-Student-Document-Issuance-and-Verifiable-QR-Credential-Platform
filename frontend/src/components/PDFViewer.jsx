import { useState } from "react";
import { Download, ExternalLink, FileText, Loader2 } from "lucide-react";

/**
 * PDFViewer
 * Props:
 *   url      — direct URL to the signed PDF (from Supabase storage or backend)
 *   title    — document name shown in header
 *   height   — iframe height (default "600px")
 */
export default function PDFViewer({ url, title = "Document", height = "600px" }) {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400 bg-gray-50 rounded-xl border border-gray-200">
        <FileText size={36} strokeWidth={1.2} className="text-gray-300" />
        <p className="text-sm font-medium text-gray-500">No document available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 text-gray-700">
          <FileText size={15} strokeWidth={1.5} className="text-blue-500" />
          <span className="text-sm font-semibold truncate max-w-xs">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            <ExternalLink size={13} /> Open in new tab
          </a>
          <a
            href={url}
            download
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-1.5 rounded-lg"
          >
            <Download size={13} /> Download
          </a>
        </div>
      </div>

      {/* Loading state */}
      {loading && !error && (
        <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
          <Loader2 size={20} className="spinning" />
          <span className="text-sm">Loading document…</span>
        </div>
      )}

      {/* Error fallback */}
      {error && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
          <FileText size={32} strokeWidth={1.2} className="text-gray-300" />
          <p className="text-sm text-gray-500">Could not preview this document in browser.</p>
          <a
            href={url}
            download
            className="flex items-center gap-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 px-5 py-2.5 rounded-lg transition-colors"
          >
            <Download size={14} /> Download instead
          </a>
        </div>
      )}

      {/* PDF iframe */}
      {!error && (
        <iframe
          src={`${url}#toolbar=0&navpanes=0`}
          title={title}
          width="100%"
          height={height}
          style={{ display: loading ? "none" : "block", border: "none" }}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
        />
      )}
    </div>
  );
}