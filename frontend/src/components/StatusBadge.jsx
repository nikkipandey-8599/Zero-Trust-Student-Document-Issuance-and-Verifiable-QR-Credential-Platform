const config = {
  pending:  { label: "Pending",  cls: "bg-amber-50 text-amber-600 border-amber-200"  },
  approved: { label: "Approved", cls: "bg-green-50 text-green-600 border-green-200"  },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-600 border-red-200"        },
  issued:   { label: "Issued",   cls: "bg-blue-50 text-blue-600 border-blue-200"     },
  revoked:  { label: "Revoked",  cls: "bg-purple-50 text-purple-600 border-purple-200"},
};

export default function StatusBadge({ status }) {
  const { label, cls } = config[status] ?? { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
}