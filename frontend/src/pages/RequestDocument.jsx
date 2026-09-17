import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";
import { DOCUMENT_CATALOG, CATEGORIES } from "../data/documentCatalog";
import { useSubmitRequest } from "../hooks/useRequests";

const STEPS = ["Choose document", "Provide details", "Confirm & submit"];

export default function RequestDocument() {
  const navigate = useNavigate();
  const { mutateAsync: submitRequest, isLoading: submitting } = useSubmitRequest();

  const [step, setStep]           = useState(0);
  const [category, setCategory]   = useState("all");
  const [selected, setSelected]   = useState(null);
  const [form, setForm]           = useState({ purpose: "", remarks: "" });
  const [customPurpose, setCustom] = useState("");
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");

  const filtered = category === "all"
    ? DOCUMENT_CATALOG
    : DOCUMENT_CATALOG.filter((d) => d.category === category);

  const finalPurpose = form.purpose === "Other" ? customPurpose : form.purpose;

  const handleNext = () => {
    if (step === 0 && !selected) { setError("Please select a document type."); return; }
    if (step === 1 && !finalPurpose.trim()) { setError("Please select or enter a purpose."); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    try {
      await submitRequest({ doc_type: selected.id, purpose: finalPurpose, remarks: form.remarks });
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (success) return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar title="Request Document" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <CheckCircle size={52} strokeWidth={1.2} className="text-green-500" />
          <h2 className="text-xl font-bold text-gray-900">Request submitted</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Your request for <strong>{selected?.name}</strong> has been submitted.
            You'll be notified when it's approved.
          </p>
          <div className="flex gap-3 mt-2">
            <button onClick={() => navigate("/track")} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
              Track my request
            </button>
            <button
              onClick={() => { setSuccess(false); setStep(0); setSelected(null); setForm({ purpose:"", remarks:"" }); }}
              className="border border-gray-200 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Submit another
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar title="Request Document" />
        <div className="max-w-4xl mx-auto w-full px-7 py-8">

          {/* Stepper */}
          <div className="flex items-center mb-8">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${i < step ? "bg-green-500 text-white" : i === step ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-[11px] mt-1 font-medium whitespace-nowrap
                    ${i === step ? "text-gray-800" : i < step ? "text-green-500" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-[1.5px] mx-2 mb-4 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-600 mb-5">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Step 0 — Choose */}
          {step === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-7">
              <h2 className="text-base font-bold text-gray-900 mb-1">What document do you need?</h2>
              <p className="text-sm text-gray-400 mb-5">Select from the catalog below.</p>

              <div className="flex gap-2 flex-wrap mb-5">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
                      ${category === cat.id ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500"}`}>
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} selected={selected?.id === doc.id} onClick={setSelected} />
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Details */}
          {step === 1 && selected && (
            <div className="bg-white border border-gray-200 rounded-2xl p-7">
              <h2 className="text-base font-bold text-gray-900 mb-1">Provide details</h2>
              <p className="text-sm text-gray-400 mb-5">Tell us why you need the <strong>{selected.name}</strong>.</p>

              {/* Eligibility */}
              <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3">Eligibility requirements</p>
                <ul className="space-y-1.5 mb-3">
                  {selected.eligibility.map((e) => (
                    <li key={e} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500 font-bold text-xs">✓</span> {e}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 border-t border-green-200 pt-3">
                  By submitting, you confirm you meet all the above conditions.
                </p>
              </div>

              {/* Purpose */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-700 block mb-2">Purpose of request</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selected.purposes.map((p) => (
                    <button key={p} onClick={() => setForm((f) => ({ ...f, purpose: p }))}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                        ${form.purpose === p ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                      {p}
                    </button>
                  ))}
                </div>
                {form.purpose === "Other" && (
                  <input type="text" value={customPurpose} onChange={(e) => setCustom(e.target.value)}
                    placeholder="Specify purpose…" autoFocus
                    className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  Additional remarks <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea rows={3} value={form.remarks} onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                  placeholder="Any specific details for the office…"
                  className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
            </div>
          )}

          {/* Step 2 — Confirm */}
          {step === 2 && selected && (
            <div className="bg-white border border-gray-200 rounded-2xl p-7">
              <h2 className="text-base font-bold text-gray-900 mb-1">Confirm your request</h2>
              <p className="text-sm text-gray-400 mb-6">Review before submitting.</p>

              <div className="divide-y divide-gray-100 mb-5">
                {[
                  ["Document",        selected.name],
                  ["Category",        selected.category],
                  ["Purpose",         finalPurpose],
                  ...(form.remarks ? [["Remarks", form.remarks]] : []),
                  ["Processing time", `${selected.processingDays} working day${selected.processingDays > 1 ? "s" : ""}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-start gap-4 py-3">
                    <span className="text-xs text-gray-400 font-medium min-w-[130px] capitalize">{k}</span>
                    <span className="text-sm text-gray-900 font-semibold text-right capitalize">{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-500">
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5 text-gray-400" />
                Once submitted, your request will be reviewed by the college office. You will be notified of any status updates.
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between mt-5">
            {step > 0
              ? <button onClick={() => { setError(""); setStep((s) => s - 1); }} disabled={submitting}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                  <ChevronLeft size={15} /> Back
                </button>
              : <div />
            }
            {step < 2
              ? <button onClick={handleNext} disabled={step === 0 && !selected}
                  className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                  Continue <ChevronRight size={15} />
                </button>
              : <button onClick={handleSubmit} disabled={submitting}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                  {submitting && <Loader2 size={14} className="spinning" />}
                  {submitting ? "Submitting…" : "Submit request"}
                </button>
            }
          </div>

        </div>
      </div>
    </div>
  );
}