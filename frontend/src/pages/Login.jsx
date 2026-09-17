import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [form, setForm]               = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleChange = (e) => {
    setError("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const user = await signIn(form.email, form.password);
      const role = user?.user_metadata?.role;
      if (role === "staff" || role === "admin") navigate("/staff");
      else navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* ── Left panel (dark) ── */}
      <div className="flex-1 bg-[#0b1120] flex flex-col justify-between px-12 py-10 relative overflow-hidden hidden lg:flex">
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#638cff 1px,transparent 1px),linear-gradient(90deg,#638cff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Glow */}
        <div className="absolute w-[480px] h-[480px] rounded-full top-[5%] -left-24 pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(79,109,245,0.14) 0%,transparent 70%)" }} />

        {/* Brand */}
        <div className="flex items-center gap-2.5 relative z-10">
          <ShieldCheck size={26} strokeWidth={1.5} className="text-blue-400" />
          <span className="text-white font-bold text-lg tracking-tight">VerifyID</span>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">
            Zero-Trust Credential Platform
          </p>
          <h1 className="text-white font-bold leading-tight mb-5" style={{ fontSize: "clamp(28px,3vw,38px)", letterSpacing: "-0.6px" }}>
            Documents you can verify.<br />
            Credentials you can trust.
          </h1>
          <p className="text-[#8a97b0] text-sm leading-relaxed max-w-sm">
            Issue, manage, and verify student credentials instantly —
            without trusting the device, network, or user.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-7 relative z-10">
          {[["3,842","Documents issued"],["98.7%","Verified successfully"],["32","Revoked credentials"]].map(([num, label], i, arr) => (
            <div key={label} className="flex items-center gap-7">
              <div>
                <p className="text-white text-xl font-bold tracking-tight">{num}</p>
                <p className="text-[#566378] text-[11px] uppercase tracking-wider mt-0.5">{label}</p>
              </div>
              {i < arr.length - 1 && <div className="w-px h-8 bg-[#1e2d44]" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (light) ── */}
      <div className="w-full lg:w-[480px] flex-shrink-0 bg-gray-50 flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-[380px] bg-white rounded-2xl p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]">

          <div className="mb-7">
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight mb-1.5">Sign in</h2>
            <p className="text-sm text-gray-500">Use your college email address to continue.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm text-red-600 mb-5">
              <AlertCircle size={15} className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email address
              </label>
              <input
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="you@college.edu"
                disabled={loading}
                autoComplete="email"
                className="w-full h-11 border-[1.5px] border-gray-200 rounded-lg px-3.5 text-sm text-gray-900 bg-gray-50 outline-none placeholder-gray-300 focus:border-blue-500 focus:bg-white focus:ring-[3px] focus:ring-blue-500/10 transition-all disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-gray-600">Password</label>
                <button type="button" className="text-xs text-blue-500 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full h-11 border-[1.5px] border-gray-200 rounded-lg pl-3.5 pr-11 text-sm text-gray-900 bg-gray-50 outline-none placeholder-gray-300 focus:border-blue-500 focus:bg-white focus:ring-[3px] focus:ring-blue-500/10 transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  aria-label={showPassword ? "Hide" : "Show"}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors mt-1"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinning" />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Not a student?{" "}
            <a href="/verify" className="text-blue-500 font-medium hover:underline">
              Verify a credential
            </a>
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-[11.5px] text-gray-400">
            <ShieldCheck size={12} strokeWidth={1.5} className="text-blue-400" />
            Every session is verified — zero implicit trust.
          </div>
        </div>
      </div>
    </div>
  );
}