import { useState } from "react";
import { FileText, Download, QrCode, Share2, Search, Loader2, FolderOpen } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useDocuments } from "../hooks/useDocuments";

function DocumentCard({ doc }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/verify/${doc.credential_id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      {/* Top */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FileText size={18} strokeWidth={1.4} className="text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {doc.doc_type?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Issued {new Date(doc.issue_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <span className="text-[11px] font-medium bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full">
          Valid
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400 mb-0.5">Credential ID</p>
          <p className="text-gray-700 font-mono font-medium truncate">
            {doc.credential_id?.slice(0, 12).toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">Valid until</p>
          <p className="text-gray-700 font-medium">
            {doc.expiry_date
              ? new Date(doc.expiry_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : "No expiry"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <a
          href={doc.file_url}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition-colors"
        >
          <Download size={13} /> Download
        </a>
        <a
          href={`/verify/${doc.credential_id}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg py-2 transition-colors"
        >
          <QrCode size={13} /> Verify
        </a>
        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg py-2 transition-colors"
        >
          <Share2 size={13} />
          {copied ? "Copied!" : "Share"}
        </button>
      </div>
    </div>
  );
}

export default function MyDocuments() {
  const { data: documents, isLoading, isError } = useDocuments();
  const [search, setSearch] = useState("");

  const filtered = documents?.filter((d) =>
    d.doc_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar title="My Documents" />
        <div className="max-w-5xl mx-auto w-full px-7 py-8">

          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 size={22} className="spinning mr-2" /> Loading documents…
            </div>
          )}

          {isError && (
            <div className="text-center py-20 text-red-400">
              Could not load documents. Please refresh.
            </div>
          )}

          {!isLoading && !isError && filtered?.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <FolderOpen size={40} strokeWidth={1.2} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-500">No documents yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your issued documents will appear here.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {!isLoading && filtered?.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}