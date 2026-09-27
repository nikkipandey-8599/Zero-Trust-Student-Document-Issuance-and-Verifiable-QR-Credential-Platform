import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ShieldCheck,
  ShieldX,
  Search,
  Loader2,
} from "lucide-react";
import api from "../services/api";

export default function VerifyCredential() {
  const { credentialId: routeCredentialId } = useParams();

  const [credentialId, setCredentialId] = useState(
    routeCredentialId || ""
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (routeCredentialId) {
      setCredentialId(routeCredentialId);
      verify(routeCredentialId);
    }
  }, [routeCredentialId]);

  const verify = async (id = credentialId) => {
    if (!id.trim()) {
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await api.get(
        `/verify/${id.trim()}`
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);

      setResult({
        valid: false,
        status: "CREDENTIAL_NOT_FOUND",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-12">

      <div className="mx-auto max-w-3xl">

        {/* Logo */}
        <div className="mb-10 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
            <ShieldCheck
              size={34}
              className="text-white"
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-white">
            VerifyID
          </h1>

          <p className="mt-2 text-slate-400">
            Public Credential Verification
          </p>

        </div>

        {/* Search */}
        <div className="rounded-2xl bg-white p-6 shadow-2xl">

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Credential ID
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              value={credentialId}
              onChange={(e) =>
                setCredentialId(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  verify();
                }
              }}
              placeholder="VID-XXXXXXXX"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              onClick={() => verify()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Search size={18} />
              )}

              Verify
            </button>

          </div>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`mt-6 overflow-hidden rounded-2xl border ${
              result.valid
                ? "border-green-200 bg-white"
                : "border-red-200 bg-white"
            }`}
          >

            <div
              className={`px-6 py-5 ${
                result.valid
                  ? "bg-green-50"
                  : "bg-red-50"
              }`}
            >

              <div className="flex items-center gap-3">

                {result.valid ? (
                  <ShieldCheck
                    size={30}
                    className="text-green-600"
                  />
                ) : (
                  <ShieldX
                    size={30}
                    className="text-red-600"
                  />
                )}

                <div>

                  <h2
                    className={`text-xl font-bold ${
                      result.valid
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {result.valid
                      ? "Credential Valid"
                      : "Credential Invalid"}
                  </h2>

                  <p
                    className={`text-sm ${
                      result.valid
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {result.status}
                  </p>

                </div>
              </div>
            </div>

            {result.valid && (
              <div className="grid gap-5 p-6 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Credential ID
                  </p>

                  <p className="mt-1 font-mono font-semibold text-slate-800">
                    {result.credentialId}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Student
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {result.studentName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Document
                  </p>

                  <p className="mt-1 text-slate-700">
                    {result.documentType}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    {result.status}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Issued
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {new Date(
                      result.issuedAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Expires
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {new Date(
                      result.expiresAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    SHA-256 Document Hash
                  </p>

                  <p className="mt-2 break-all rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600">
                    {result.documentHash}
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          VerifyID uses cryptographic credential verification to
          validate issued academic credentials.
        </p>

      </div>
    </div>
  );
}