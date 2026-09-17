const categoryStyles = {
  academic:       "bg-blue-50",
  administrative: "bg-amber-50",
  identity:       "bg-green-50",
  special:        "bg-purple-50",
};

export default function DocumentCard({ doc, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(doc)}
      aria-pressed={selected}
      className={`w-full flex items-start gap-3 p-4 rounded-xl border-[1.5px] text-left transition-all cursor-pointer font-sans
        ${selected
          ? "border-blue-500 bg-blue-50/40 shadow-[0_0_0_3px_rgba(79,109,245,0.1)]"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"}`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg
        ${categoryStyles[doc.category] ?? "bg-gray-100"}`}>
        {doc.icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 mb-0.5">{doc.name}</p>
        <p className="text-xs text-gray-500 leading-relaxed mb-1.5">{doc.desc}</p>
        <p className="text-[11px] text-gray-400">
          ⏱ {doc.processingDays} working day{doc.processingDays > 1 ? "s" : ""}
        </p>
      </div>

      {/* Selected check */}
      {selected && (
        <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          ✓
        </span>
      )}
    </button>
  );
}