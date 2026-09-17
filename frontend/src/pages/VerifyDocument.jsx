import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  ShieldCheck, ShieldX, AlertTriangle, Download,
  FileText, Loader2, ExternalLink,
} from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export default function VerifyDocument() {
  const { credentialId } = useParams();
  const [searchParams] = useSearchParams();
  const id = credentialId || searchParams.get("id");

  const [state, setState] = useState("idle"); // idle | loading | valid | revoked | invalid
  const [data, setData]   = useState(null);
  const [inputId, setInputId] = useState("");

  const verify = async (cid) => {
    if (!cid?.trim()) return;
    setState("loading");
    try {
      const res = await axios.get(`${API}/verify/${cid.trim()}`);
      setData(res.data);
      setState(res.data.status === "revoked" ? "revoked" : "valid");
    } catch (err) {
      setState(err.response?.status === 404 ? "invalid" : "invalid");
    }
  };

  useEffect(() => {
    if (id) verify(id);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={22} strokeWidth={1.5} className="text-blue-400" />
          <span className="text-white font-bold text-base tracking-tight">VerifyID</span>
        </div>
        <span className="text-xs text-white/40 uppercase tracking-widest">
          Credential Verification
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* Idle — manual entry */}
          {state === "idle" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <ShieldCheck size={44} strokeWidth={1.2} className="text-blue-400 mx-auto mb-4" />
              <h1 className="text-white text-xl font-bold mb-2">Verify a credential</h1>
              <p className="text-white/50 text-sm mb-6">
                Enter the credential ID printed on the document, or scan the QR code.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Credential ID (e.g. ZT-2026-8F92A1)"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && verify(inputId)}
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                />
                <button
                  onClick={() => verify(inputId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {state === "loading" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
              <Loader2 size={36} className="text-blue-400 mx-auto mb-4 spinning" />
              <p className="text-white/70 text-sm">Verifying credential…</p>
              <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
                {["Credential found in registry", "Validating digital signature", "Checking document integrity", "Checking revocation status"].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-white/40">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Valid */}
          {state === "valid" && data && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              {/* Green banner */}
              <div className="bg-green-500 px-6 py-5 flex items-center gap-3">
                <ShieldCheck size={28} strokeWidth={1.5} className="text-white" />
                <div>
                  <p className="text-white font-bold text-base">Credential Valid</p>
                  <p className="text-green-100 text-xs">
                    This document is authentic and has not been revoked.
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="px-6 py-5 space-y-3">
                {[
                  ["Student",      data.student_name],
                  ["Roll No",      data.roll_no],
                  ["Document",     data.doc_type?.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())],
                  ["Issued By",    data.issued_by],
                  ["Issued On",    new Date(data.issued_at).toLocaleDateString("en-IN", { day:"numeric",month:"long",year:"numeric" })],
                  ["Valid Until",  data.expiry_date ? new Date(data.expiry_date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "No expiry"],
                  ["Credential ID",data.credential_id],
                ].map(([key, val]) => (
                  <div key={key} className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-400 font-medium min-w-[110px]">{key}</span>
                    <span className="text-sm text-gray-800 font-semibold text-right">{val}</span>
                  </div>
                ))}
              </div>

              {/* View actual document */}
              <div className="px-6 pb-6 flex gap-3">
                <a
                  href={data.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                >
                  <FileText size={15} /> View Document
                </a>
                <a
                  href={data.file_url}
                  download
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
                >
                  <Download size={15} />
                </a>
              </div>
            </div>
          )}

          {/* Revoked */}
          {state === "revoked" && data && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-amber-500 px-6 py-5 flex items-center gap-3">
                <AlertTriangle size={28} strokeWidth={1.5} className="text-white" />
                <div>
                  <p className="text-white font-bold text-base">Credential Revoked</p>
                  <p className="text-amber-100 text-xs">
                    This credential was valid but has been revoked. Do not accept this document.
                  </p>
                </div>
              </div>
              <div className="px-6 py-5 space-y-3">
                {[
                  ["Student",       data.student_name],
                  ["Document",      data.doc_type?.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())],
                  ["Revoked by",    data.revoked_by],
                  ["Revoked on",    new Date(data.revoked_at).toLocaleDateString("en-IN")],
                  ["Reason",        data.revocation_reason],
                ].map(([key, val]) => (
                  <div key={key} className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-400 font-medium min-w-[110px]">{key}</span>
                    <span className="text-sm text-gray-800 font-semibold text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invalid */}
          {state === "invalid" && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-red-500 px-6 py-5 flex items-center gap-3">
                <ShieldX size={28} strokeWidth={1.5} className="text-white" />
                <div>
                  <p className="text-white font-bold text-base">Credential Invalid</p>
                  <p className="text-red-100 text-xs">
                    This credential could not be found or verified. Do not accept this document.
                  </p>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-gray-500 mb-2">Possible reasons:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>The document is fake or not issued by this platform</li>
                  <li>The QR code has been tampered with</li>
                  <li>The credential ID does not exist</li>
                </ul>
                <button
                  onClick={() => { setState("idle"); setData(null); }}
                  className="mt-5 w-full border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Try another credential
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          {state !== "idle" && (
            <p className="text-center text-white/30 text-xs mt-6">
              Powered by VerifyID · Zero-Trust Credential Platform
            </p>
          )}

        </div>
      </div>
    </div>
  );
}