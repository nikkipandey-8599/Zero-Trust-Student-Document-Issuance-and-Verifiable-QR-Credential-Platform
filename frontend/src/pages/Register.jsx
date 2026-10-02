import { useState } from "react";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", {
        fullName,
        email,
        password,
      });

      setSuccess("Account created successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create account"
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
              Create a secure account to request and manage your
              official academic documents.
            </p>

          </div>

          {/* Card */}
          <div className="rounded-[24px] border border-[#DDD4E3] bg-white p-6 shadow-sm sm:p-8">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7A668E]">
                Student registration
              </p>

              <h2 className="mt-2 font-serif text-2xl font-bold text-[#292632]">
                Create your account
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-[#5F5964]">
                Register to access the VerifyID student portal.
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

            {/* Success */}
            {success && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-5 text-emerald-700"
              >
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* Full name */}
              <div>

                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-bold text-[#38313E]"
                >
                  Full name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817A85]"
                  />

                  <input
                    id="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="Your full name"
                    className="h-12 w-full rounded-xl border border-[#CEC4D5] bg-white py-3 pl-11 pr-4 text-sm font-medium text-[#292632] outline-none transition placeholder:text-[#817A85] hover:border-[#B9ABC2] focus:border-[#8E7AA8] focus:ring-2 focus:ring-[#8E7AA8]/20"
                  />

                </div>

              </div>

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
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Minimum 8 characters"
                    className="h-12 w-full rounded-xl border border-[#CEC4D5] bg-white py-3 pl-11 pr-4 text-sm font-medium text-[#292632] outline-none transition placeholder:text-[#817A85] hover:border-[#B9ABC2] focus:border-[#8E7AA8] focus:ring-2 focus:ring-[#8E7AA8]/20"
                  />

                </div>

                <p className="mt-2 text-xs font-medium text-[#6D6670]">
                  Use at least 8 characters.
                </p>

              </div>

              {/* Submit */}
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8E7AA8] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#796591] focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
              >
                Create account
                <ArrowRight size={17} />
              </button>

            </form>

            {/* Login */}
            <div className="mt-6 border-t border-[#E5DEE8] pt-5 text-center text-sm text-[#5F5964]">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-bold text-[#735F87] underline-offset-4 hover:text-[#594968] hover:underline focus:outline-none focus:ring-2 focus:ring-[#8E7AA8] focus:ring-offset-2"
              >
                Sign in
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