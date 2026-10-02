import {
  FileText,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-indigo-600">
            Student Portal
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Welcome back, {user?.fullName || "Student"}
          </h1>

          <p className="mt-2 text-slate-500">
            Request, track and verify your official academic documents.
          </p>
        </div>

        {/* Overview */}
        <div className="grid gap-5 md:grid-cols-3">

          <StatCard
            icon={<FileText />}
            title="Documents"
            value="4"
            subtitle="Available services"
          />

          <StatCard
            icon={<Clock />}
            title="Requests"
            value="Track"
            subtitle="View your document requests"
          />

          <StatCard
            icon={<CheckCircle2 />}
            title="Credentials"
            value="Verify"
            subtitle="Verify issued credentials"
          />

        </div>

        {/* Actions */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Request Document */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Request a document
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Request bonafide certificates, transcripts, migration
              certificates and other official documents.
            </p>

            <Link
              to="/student/requests/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Start request
              <ArrowRight size={17} />
            </Link>

          </div>

          {/* Verify Credential */}
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-7 text-white">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Verify a credential
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Anyone can verify an issued VerifyID credential using its
              unique credential ID.
            </p>

            <Link
              to="/verify"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Open verification
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </main>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-5 font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {subtitle}
      </p>

    </div>
  );
}