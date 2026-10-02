import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Hash,
  Loader2,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function VerifyCredential() {
  const { credentialId: routeCredentialId } = useParams();

  const [credentialId, setCredentialId] = useState(
    routeCredentialId || ""
  );

  const [credential, setCredential] = useState(null);

  const [loading, setLoading] = useState(
    Boolean(routeCredentialId)
  );

  const [error, setError] = useState("");

  const verifyCredential = async (id) => {
    const cleanId = id.trim();

    if (!cleanId) {
      setError("Please enter a credential ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCredential(null);

      const response = await api.get(
        `/verify/${encodeURIComponent(cleanId)}`
      );

      setCredential(response.data);
      setCredentialId(cleanId);
    } catch (err) {
      console.error("Credential verification failed:", err);

      setCredential(null);

      if (err?.response?.status === 404) {
        setError(
          "Credential not found. Please check the credential ID and try again."
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Unable to verify this credential."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeCredentialId) {
      verifyCredential(routeCredentialId);
    }
  }, [routeCredentialId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    verifyCredential(credentialId);
  };

  const isRevoked =
    credential?.status === "CREDENTIAL_REVOKED" ||
    credential?.status === "REVOKED";

  const isValid =
    !isRevoked &&
    (
      credential?.status === "CREDENTIAL_VALID" ||
      credential?.status === "ACTIVE" ||
      credential?.status === "VALID"
    );

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#65566F] transition hover:text-[#493A54] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Header */}
        <section className="mt-7 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE9F3] text-[#735F87]">
            <ShieldCheck size={28} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.17em] text-[#7A668E]">
            Public verification
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#292632] sm:text-4xl">
            Verify a digital credential
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-6 text-[#5F5964]">
            Enter a VerifyID credential ID to check its authenticity,
            current status and cryptographic verification details.
          </p>

        </section>

        {/* Search */}
        <section className="mx-auto mt-8 max-w-3xl rounded-[22px] border border-[#E0D8E4] bg-white p-5 shadow-sm sm:p-6">

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >

            <div className="relative flex-1">

              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#817A85]"
              />

              <input
                type="text"
                value={credentialId}
                onChange={(event) =>
                  setCredentialId(event.target.value)
                }
                placeholder="Enter credential ID, e.g. VID-45DC37C0"
                className="h-12 w-full rounded-xl border border-[#CEC4D5] bg-white pl-11 pr-4 text-sm font-bold text-[#292632] shadow-sm placeholder:font-medium placeholder:text-[#817A85] focus:border-[#8E7AA8] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8]/20"
                aria-label="Credential ID"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#8E7AA8] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Verifying...
                </>
              ) : (
                <>
                  Verify credential
                  <ShieldCheck size={17} />
                </>
              )}
            </button>

          </form>

          <p className="mt-3 text-xs font-medium text-[#5F5964]">
            Verification is public and does not require a student or staff
            account.
          </p>

        </section>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-3">

              <XCircle
                size={21}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>

                <h2 className="font-bold text-red-800">
                  Verification failed
                </h2>

                <p className="mt-1 text-sm leading-5 text-red-700">
                  {error}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* Result */}
        {credential && (
          <section className="mx-auto mt-7 max-w-3xl overflow-hidden rounded-[24px] border border-[#D9CFDF] bg-white shadow-sm">

            {/* Result header */}
            <div
              className={
                isRevoked
                  ? "border-b border-red-200 bg-red-50 px-6 py-6 sm:px-7"
                  : "border-b border-emerald-200 bg-emerald-50 px-6 py-6 sm:px-7"
              }
            >

              <div className="flex items-start gap-4">

                <div
                  className={
                    isRevoked
                      ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600"
                      : "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"
                  }
                >
                  {isRevoked ? (
                    <XCircle size={25} />
                  ) : (
                    <CheckCircle2 size={25} />
                  )}
                </div>

                <div className="min-w-0">

                  <p
                    className={
                      isRevoked
                        ? "text-xs font-bold uppercase tracking-[0.15em] text-red-700"
                        : "text-xs font-bold uppercase tracking-[0.15em] text-emerald-700"
                    }
                  >
                    Verification result
                  </p>

                  <h2
                    className={
                      isRevoked
                        ? "mt-1 text-2xl font-bold text-red-900"
                        : "mt-1 text-2xl font-bold text-emerald-900"
                    }
                  >
                    {isRevoked
                      ? "Credential revoked"
                      : isValid
                        ? "Credential verified"
                        : "Credential found"}
                  </h2>

                  <p
                    className={
                      isRevoked
                        ? "mt-1 text-sm text-red-700"
                        : "mt-1 text-sm text-emerald-700"
                    }
                  >
                    {isRevoked
                      ? "This credential is no longer considered valid."
                      : "The credential was successfully verified by VerifyID."}
                  </p>

                </div>

              </div>

            </div>

            {/* Result body */}
            <div className="p-6 sm:p-7">

              {/* Document */}
              <div>

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7A668E]">
                  Credentialed document
                </p>

                <h3 className="mt-2 text-2xl font-bold text-[#292632]">
                  {credential?.documentType ||
                    credential?.documentName ||
                    "Academic Document"}
                </h3>

              </div>

              {/* Credential ID */}
              <div className="mt-6 rounded-xl border border-[#E2DAE6] bg-[#FBF9FC] p-4">

                <div className="flex items-center gap-3">

                  <FileCheck2
                    size={20}
                    className="shrink-0 text-[#735F87]"
                  />

                  <div className="min-w-0">

                    <p className="text-xs font-bold uppercase tracking-wide text-[#7A668E]">
                      Credential ID
                    </p>

                    <code className="mt-1 block break-all text-sm font-bold text-[#493C52]">
                      {credential?.credentialId ||
                        credentialId}
                    </code>

                  </div>

                </div>

              </div>

              {/* Information */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <InfoCard
                  label="Verification status"
                  value={
                    isRevoked
                      ? "Revoked"
                      : isValid
                        ? "Active & Verified"
                        : credential?.status || "Verified"
                  }
                />

                <InfoCard
                  label="Issued"
                  value={formatDateTime(
                    credential?.issuedAt
                  )}
                />

                <InfoCard
                  label="Expires"
                  value={formatDateTime(
                    credential?.expiresAt
                  )}
                />

                <InfoCard
                  label="Verification method"
                  value="Digital signature"
                />

              </div>

              {/* Hash */}
              <div className="mt-5 rounded-xl border border-[#E2DAE6] bg-[#FBF9FC] p-4">

                <div className="flex items-start gap-3">

                  <Hash
                    size={19}
                    className="mt-0.5 shrink-0 text-[#735F87]"
                  />

                  <div className="min-w-0">

                    <p className="text-xs font-bold uppercase tracking-wide text-[#7A668E]">
                      Document hash
                    </p>

                    <code className="mt-2 block break-all text-xs leading-5 text-[#5B5360]">
                      {credential?.documentHash ||
                        "Not available"}
                    </code>

                  </div>

                </div>

              </div>

              {/* Trust statement */}
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#F3EFF5] p-4">

                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#735F87]"
                />

                <p className="text-sm leading-5 text-[#514957]">
                  Verification is performed against the credential's
                  cryptographic signature and current credential status.
                </p>

              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-[#E3DCE6] bg-[#FBF9FC] px-6 py-5 sm:px-7">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs font-semibold text-[#655E68]">
                  VerifyID public credential verification
                </p>

                <Link
                  to={`/verify/${credential?.credentialId || credentialId}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#CEC4D5] bg-white px-4 text-sm font-bold text-[#594B68] transition hover:bg-[#F1ECF4] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
                >
                  Refresh verification
                  <ExternalLink size={15} />
                </Link>

              </div>

            </div>

          </section>
        )}

        {/* Initial state */}
        {!credential && !error && !loading && (
          <section className="mx-auto mt-7 max-w-3xl rounded-[24px] border border-[#E0D8E4] bg-white px-6 py-14 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE9F3] text-[#735F87]">
              <ShieldCheck size={27} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#292632]">
              Ready to verify
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5F5964]">
              Enter a credential ID above to check the document's
              authenticity and current status.
            </p>

          </section>
        )}

      </main>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E2DAE6] bg-[#FBF9FC] p-4">

      <p className="text-xs font-bold uppercase tracking-wide text-[#7A668E]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#292632]">
        {value || "—"}
      </p>

    </div>
  );
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}