import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  Loader2,
  QrCode,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Credential() {
  const { credentialId } = useParams();
  const { user } = useAuth();

  const canRevoke =
    user?.role === "STAFF" ||
    user?.role === "ADMIN";

  const [credential, setCredential] = useState(null);
  const [qrCode, setQrCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const loadCredential = async () => {
    try {
      setLoading(true);
      setError("");

      const [credentialResponse, qrResponse] =
        await Promise.all([
          api.get(`/verify/${credentialId}`),
          api.get(`/qr/${credentialId}`),
        ]);

      setCredential(credentialResponse.data);

      setQrCode(
        qrResponse.data?.qrCode ||
          qrResponse.data?.image ||
          qrResponse.data?.data ||
          ""
      );
    } catch (err) {
      console.error("Failed to load credential:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load this credential."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (credentialId) {
      loadCredential();
    }
  }, [credentialId]);

  const downloadPdf = async () => {
    try {
      setDownloading(true);
      setError("");
      setMessage("");

      const response = await api.get(
        `/credentials/${credentialId}/pdf`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${credentialId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage("Credential PDF downloaded successfully.");
    } catch (err) {
      console.error("Failed to download credential:", err);

      setError(
        "Unable to download the credential PDF."
      );
    } finally {
      setDownloading(false);
    }
  };

  const revokeCredential = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this credential? It will no longer be considered valid during verification."
    );

    if (!confirmed) {
      return;
    }

    try {
      setRevoking(true);
      setError("");
      setMessage("");

      await api.post(
        `/credentials/${credentialId}/revoke`
      );

      setMessage(
        "Credential revoked successfully."
      );

      await loadCredential();
    } catch (err) {
      console.error("Failed to revoke credential:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to revoke this credential."
      );
    } finally {
      setRevoking(false);
    }
  };

  const copyCredentialId = async () => {
    try {
      await navigator.clipboard.writeText(
        credentialId
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError(
        "Unable to copy the credential ID."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <Navbar />

        <main className="mx-auto flex max-w-5xl items-center justify-center px-6 py-24">
          <div className="flex items-center gap-3 text-sm font-bold text-[#5F5964]">
            <Loader2
              size={20}
              className="animate-spin"
            />
            Loading credential...
          </div>
        </main>
      </div>
    );
  }

  if (error && !credential) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-10">

          <Link
            to="/staff"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#65566F] hover:text-[#493A54]"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>

        </main>
      </div>
    );
  }

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

      <main className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/staff/requests"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#65566F] transition hover:text-[#493A54] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
        >
          <ArrowLeft size={16} />
          Back to requests
        </Link>

        {/* Alerts */}
        {message && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Credential */}
        <section className="mt-6 overflow-hidden rounded-[26px] border border-[#D9CFDF] bg-white shadow-sm">

          {/* Credential Header */}
          <div className="border-b border-[#DDD4E3] bg-[#EEE9F3] px-6 py-7 sm:px-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8E7AA8] text-white shadow-sm">
                  <ShieldCheck size={29} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#735F87]">
                    Digital credential
                  </p>

                  <h1 className="mt-1 text-2xl font-bold text-[#292632]">
                    VerifyID
                  </h1>

                  <p className="mt-1 text-sm font-semibold text-[#5F5964]">
                    Cryptographically signed academic credential
                  </p>

                </div>

              </div>

              <StatusBanner
                isRevoked={isRevoked}
                isValid={isValid}
              />

            </div>

          </div>

          {/* Credential Body */}
          <div className="p-6 sm:p-8">

            <div className="grid gap-8 lg:grid-cols-[1fr_260px]">

              {/* Information */}
              <div>

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7A668E]">
                  Issued credential
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#292632]">
                  {credential?.documentType ||
                    credential?.documentName ||
                    "Academic Document"}
                </h2>

                <p className="mt-2 text-base text-[#5F5964]">
                  This credential was issued through the VerifyID
                  document issuance workflow.
                </p>

                {/* Credential ID */}
                <div className="mt-7">

                  <p className="text-xs font-bold uppercase tracking-wide text-[#7A668E]">
                    Credential ID
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">

                    <code className="rounded-lg bg-[#F3EFF5] px-3 py-2 text-sm font-bold text-[#4F405D]">
                      {credential?.credentialId ||
                        credentialId}
                    </code>

                    <button
                      type="button"
                      onClick={copyCredentialId}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#CEC4D5] bg-white px-3 text-xs font-bold text-[#5F5068] transition hover:bg-[#F3EFF5] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
                    >
                      <Copy size={14} />

                      {copied
                        ? "Copied"
                        : "Copy"}
                    </button>

                  </div>

                </div>

                {/* Metadata */}
                <div className="mt-7 grid gap-4 sm:grid-cols-2">

                  <InfoBlock
                    label="Status"
                    value={
                      isRevoked
                        ? "Revoked"
                        : "Active & Verified"
                    }
                  />

                  <InfoBlock
                    label="Issued"
                    value={formatDateTime(
                      credential?.issuedAt
                    )}
                  />

                  <InfoBlock
                    label="Expires"
                    value={formatDateTime(
                      credential?.expiresAt
                    )}
                  />

                  <InfoBlock
                    label="Verification"
                    value="Digital signature"
                  />

                </div>

                {/* Hash */}
                <div className="mt-7">

                  <p className="text-xs font-bold uppercase tracking-wide text-[#7A668E]">
                    Document hash
                  </p>

                  <div className="mt-2 rounded-xl border border-[#E1D9E5] bg-[#FAF8FB] p-4">

                    <code className="break-all text-xs leading-5 text-[#5B5360]">
                      {credential?.documentHash ||
                        "Not available"}
                    </code>

                  </div>

                </div>

              </div>

              {/* QR */}
              <div className="lg:border-l lg:border-[#E4DDE7] lg:pl-8">

                <div className="rounded-2xl border border-[#DDD4E3] bg-[#FBF9FC] p-5">

                  <div className="flex items-center gap-2">

                    <QrCode
                      size={18}
                      className="text-[#735F87]"
                    />

                    <h3 className="text-sm font-bold text-[#292632]">
                      Public verification
                    </h3>

                  </div>

                  <div className="mt-5 flex items-center justify-center rounded-xl bg-white p-4 shadow-sm">

                    {qrCode ? (
                      <img
                        src={
                          qrCode.startsWith("data:")
                            ? qrCode
                            : `data:image/png;base64,${qrCode}`
                        }
                        alt="Credential verification QR code"
                        className="h-44 w-44 object-contain"
                      />
                    ) : (
                      <div className="flex h-44 w-44 items-center justify-center text-center text-xs font-semibold text-[#817A85]">
                        QR code unavailable
                      </div>
                    )}

                  </div>

                  <p className="mt-4 text-center text-xs leading-5 text-[#5F5964]">
                    Scan this QR code to independently verify this
                    credential.
                  </p>

                  <Link
                    to={`/verify/${credentialId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#CFC3D9] bg-white text-sm font-bold text-[#594B68] transition hover:bg-[#F1ECF4] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
                  >
                    Open public verification
                    <ExternalLink size={15} />
                  </Link>

                </div>

              </div>

            </div>

          </div>

          {/* Actions */}
          <div className="border-t border-[#E3DCE6] bg-[#FBF9FC] px-6 py-5 sm:px-8">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2 text-xs font-semibold text-[#655E68]">

                <FileCheck2 size={16} />

                <span>
                  This credential can be independently verified using
                  its cryptographic signature.
                </span>

              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={downloading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8E7AA8] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloading ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Download size={17} />
                  )}

                  {downloading
                    ? "Downloading..."
                    : "Download credential PDF"}
                </button>

                {canRevoke && !isRevoked && (
                  <button
                    type="button"
                    onClick={revokeCredential}
                    disabled={revoking}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 text-sm font-bold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {revoking ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <XCircle size={17} />
                    )}

                    {revoking
                      ? "Revoking..."
                      : "Revoke credential"}
                  </button>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* Revoked notice */}
        {isRevoked && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">

            <XCircle
              size={22}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>

              <h3 className="font-bold text-red-800">
                Credential revoked
              </h3>

              <p className="mt-1 text-sm leading-5 text-red-700">
                This credential is no longer considered valid.
                Public verification will show its revoked status.
              </p>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

function StatusBanner({ isRevoked, isValid }) {
  if (isRevoked) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
        <XCircle size={16} />
        Credential revoked
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
      <CheckCircle2 size={16} />
      {isValid
        ? "Credential active & verified"
        : "Credential verified"}
    </div>
  );
}

function InfoBlock({ label, value }) {
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