import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  QrCode,
  ExternalLink,
  Loader2,
  CheckCircle,
  Download,
  Ban,
} from "lucide-react";
import api from "../services/api";

export default function Credential() {
  const { credentialId } = useParams();

  const [credential, setCredential] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    const loadCredential = async () => {
      try {
        setLoading(true);
        setError("");

        const verificationResponse = await api.get(
          `/verify/${credentialId}`
        );

        const qrResponse = await api.get(
          `/qr/${credentialId}`
        );

        setCredential(verificationResponse.data);
        setQrCode(qrResponse.data.qrCode);
      } catch (err) {
        console.error(err);
        setError("Unable to load this credential.");
      } finally {
        setLoading(false);
      }
    };

    if (credentialId) {
      loadCredential();
    }
  }, [credentialId]);

  const downloadPdf = async () => {
    try {
      const response = await api.get(
        `/credentials/${credentialId}/pdf`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = `${credentialId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Unable to download credential PDF.");
    }
  };

  const revokeCredential = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this credential?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRevoking(true);

      await api.post(
        `/credentials/${credentialId}/revoke`
      );

      alert("Credential revoked successfully.");

      // Reload the credential so the status updates.
      window.location.reload();

    } catch (error) {
      console.error(
        "Credential revocation failed:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to revoke credential."
      );

    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2
          size={36}
          className="animate-spin text-indigo-400"
        />
      </div>
    );
  }

  if (error || !credential) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
        <div className="rounded-2xl bg-white p-8 text-center">
          <p className="font-semibold text-red-600">
            {error || "Credential not found"}
          </p>

          <Link
            to="/verify"
            className="mt-5 inline-block text-sm font-semibold text-indigo-600"
          >
            Go to verification
          </Link>
        </div>
      </div>
    );
  }

  const qrImage = `data:image/png;base64,${qrCode}`;

  /*
   * Backend returns CREDENTIAL_REVOKED.
   * We support both values for safety.
   */
  const isRevoked =
    credential.status === "CREDENTIAL_REVOKED" ||
    credential.status === "REVOKED";

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-10">

      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          to="/staff"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-7 text-white">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-white/15 p-3">
                <ShieldCheck size={32} />
              </div>

              <div>

                <p className="text-sm font-medium text-indigo-100">
                  DIGITAL CREDENTIAL
                </p>

                <h1 className="text-2xl font-bold">
                  VerifyID
                </h1>

              </div>

            </div>

            {/* Status banner */}
            <div
              className={`mt-7 flex items-center gap-2 rounded-xl px-4 py-3 ${
                isRevoked
                  ? "bg-red-500/20 text-red-100"
                  : "bg-white/10"
              }`}
            >

              {isRevoked ? (
                <Ban size={20} />
              ) : (
                <CheckCircle size={20} />
              )}

              <span className="font-semibold">
                {isRevoked
                  ? "Credential Revoked"
                  : "Credential Active & Verified"}
              </span>

            </div>

          </div>

          {/* Credential */}
          <div className="grid gap-8 p-7 md:grid-cols-[1fr_220px]">

            <div>

              <p className="text-sm font-semibold text-indigo-600">
                {credential.documentType}
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {credential.studentName}
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                {/* Credential ID */}
                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Credential ID
                  </p>

                  <p className="mt-1 font-mono font-semibold text-slate-800">
                    {credential.credentialId}
                  </p>

                </div>

                {/* Status */}
                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      isRevoked
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {credential.status}
                  </p>

                </div>

                {/* Issued */}
                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Issued
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {credential.issuedAt
                      ? new Date(
                          credential.issuedAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>

                </div>

                {/* Expires */}
                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Expires
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {credential.expiresAt
                      ? new Date(
                          credential.expiresAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>

                </div>

              </div>

              {/* Hash */}
              <div className="mt-7 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Document Hash
                </p>

                <p className="mt-2 break-all font-mono text-xs text-slate-600">
                  {credential.documentHash}
                </p>

              </div>

              {/* Buttons */}
              <div className="mt-7 flex flex-wrap gap-3">

                {/* Download */}
                <button
                  onClick={downloadPdf}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <Download size={17} />
                  Download Credential PDF
                </button>

                {/* Revoke */}
                {!isRevoked && (
                  <button
                    onClick={revokeCredential}
                    disabled={revoking}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {revoking ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Revoking...
                      </>
                    ) : (
                      <>
                        <Ban size={17} />
                        Revoke Credential
                      </>
                    )}

                  </button>
                )}

              </div>

            </div>

            {/* QR */}
            <div className="flex flex-col items-center">

              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

                {qrCode ? (
                  <img
                    src={qrImage}
                    alt="Credential verification QR code"
                    className="h-44 w-44"
                  />
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center">
                    <QrCode
                      size={50}
                      className="text-slate-300"
                    />
                  </div>
                )}

              </div>

              <p className="mt-3 text-center text-xs text-slate-500">
                Scan to verify this credential
              </p>

              <Link
                to={`/verify/${credentialId}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <ExternalLink size={16} />
                Public verification
              </Link>

            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-7 py-4 text-center text-xs text-slate-500">
            This credential can be independently verified using its
            cryptographic signature.
          </div>

        </div>
      </div>
    </div>
  );
}