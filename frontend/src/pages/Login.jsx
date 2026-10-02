import { useState } from "react";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

      if (data.role === "STAFF" || data.role === "ADMIN") {
        navigate("/staff");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] px-4 py-10 sm:px-6">

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">

        <div className="w-full">

          {/* Brand */}
          <div className="mb-7 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8E7AA8] text-white shadow-sm">
              <ShieldCheck size={29} />
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#292632]">
              VerifyID
            </h1>

            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#735F87]">
              Trusted credentials
            </p>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-5 text-[#5F5964]">
              Secure access to your student document credentials
              and verification services.
            </p>

          </div>

          {/* Card */}
          <div className="rounded-[24px] border border-[#DDD4E3] bg-white p-6 shadow-sm sm:p-8">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7A668E]">
                Secure access
              </p>

              <h2 className="mt-2 font-serif text-2xl font-bold text-[#292632]">
                Sign in to VerifyID
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-[#5F5964]">
                Access your document requests and digital credentials.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-700"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-[#38313E]"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817A85]"
                  />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-[#CEC4D5] bg-white py-3 pl-11 pr-4 text-sm font-medium text-[#292632] outline-none transition placeholder:text-[#817A85] hover:border-[#B9ABC2] focus:border-[#8E7AA8] focus:ring-2 focus:ring-[#8E7AA8]/20"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-[#38313E]"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817A85]"
                  />

                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-[#CEC4D5] bg-white py-3 pl-11 pr-4 text-sm font-medium text-[#292632] outline-none transition placeholder:text-[#817A85] hover:border-[#B9ABC2] focus:border-[#8E7AA8] focus:ring-2 focus:ring-[#8E7AA8]/20"
                  />

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8E7AA8] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

            </form>

            {/* Register */}
            <div className="mt-6 border-t border-[#E5DEE8] pt-5 text-center text-sm text-[#5F5964]">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-bold text-[#735F87] underline-offset-4 hover:text-[#594968] hover:underline focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
              >
                Create one
              </Link>

            </div>

          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-xs font-medium text-[#6D6670]">
            VerifyID · Secure student document credentials
          </p>

        </div>

      </div>

    </div>
  );
}