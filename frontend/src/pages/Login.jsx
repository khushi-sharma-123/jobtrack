import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#101423]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .login-page {
          font-family: "Inter", sans-serif;
        }

        @keyframes floatCard {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.42;
            transform: scale(1);
          }

          50% {
            opacity: 0.62;
            transform: scale(1.08);
          }
        }

        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-page {
          animation: pageEnter 0.55s ease-out;
        }

        .floating-card {
          animation: floatCard 5s ease-in-out infinite;
        }

        .floating-card-delay {
          animation: floatCard 6s ease-in-out infinite;
          animation-delay: 0.8s;
        }

        .glow {
          animation: glowPulse 7s ease-in-out infinite;
        }
      `}</style>

      <div className="login-page min-h-screen">
        {/* ==================================================
            TOP BAR
        ================================================== */}
        <header className="px-4 pt-4 md:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1026] text-white">
                <Zap size={16} />
              </div>

              <span className="text-xl font-semibold tracking-[-0.04em]">
                JobTrack
              </span>
            </Link>

            <div className="text-sm text-black/45">
              New to JobTrack?
              <Link
                to="/register"
                className="ml-1.5 font-semibold text-[#0a1026] transition hover:text-[#6d65c7]"
              >
                Create account
              </Link>
            </div>
          </div>
        </header>

        {/* ==================================================
            MAIN
        ================================================== */}
        <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-8 md:px-6 md:py-12">
          <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-black/10 bg-white shadow-[0_30px_100px_rgba(15,20,40,0.08)] lg:grid-cols-[1.05fr_0.95fr]">

            {/* ==================================================
                LEFT PRODUCT AREA
            ================================================== */}
            <section className="relative hidden min-h-[720px] overflow-hidden bg-black text-white lg:block">

              {/* Purple glow */}
              <div
                className="glow pointer-events-none absolute -right-32 -top-40 h-[620px] w-[620px] rounded-full blur-[120px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(113,105,205,0.62) 0%, rgba(76,70,147,0.3) 40%, transparent 72%)",
                }}
              />

              {/* Pink glow */}
              <div
                className="glow pointer-events-none absolute -bottom-48 -left-40 h-[600px] w-[600px] rounded-full blur-[130px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(153,57,99,0.38) 0%, rgba(88,34,65,0.2) 40%, transparent 72%)",
                }}
              />

              {/* Center atmosphere */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 blur-[140px]"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(103,95,173,0.13), transparent 70%)",
                }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">

                {/* Heading */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    <Sparkles size={12} />
                    Welcome back
                  </div>

                  <h1 className="mt-8 max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] xl:text-6xl">
                    Your job search
                    <br />
                    is already
                    <br />
                    <span className="text-[#aaa3ff]">
                      moving forward.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-lg text-sm leading-6 text-white/45">
                    Sign in to continue tracking applications, preparing for
                    interviews and keeping every next step visible.
                  </p>
                </div>

                {/* Product visual */}
                <div className="relative mt-12 min-h-[300px]">

                  {/* Main dashboard */}
                  <div className="absolute left-1/2 top-1/2 w-full max-w-[470px] -translate-x-1/2 -translate-y-1/2">
                    <div className="rounded-[1.8rem] border border-white/10 bg-white/10 p-2 backdrop-blur-xl">
                      <div className="rounded-[1.45rem] bg-[#f7f7f9] p-4 text-[#101423]">

                        <div className="flex items-center justify-between border-b border-black/5 pb-4">
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/30">
                              JobTrack overview
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              Your pipeline
                            </p>
                          </div>

                          <div className="rounded-full bg-[#eceaff] px-3 py-1 text-[9px] font-medium text-[#655db2]">
                            Active
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="rounded-xl bg-[#101423] p-3 text-white">
                            <p className="text-[8px] uppercase tracking-wider text-white/40">
                              Applied
                            </p>

                            <p className="mt-1 text-xl font-semibold">
                              24
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#eeeaff] p-3">
                            <p className="text-[8px] uppercase tracking-wider text-black/35">
                              Interviews
                            </p>

                            <p className="mt-1 text-xl font-semibold">
                              08
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#e8f8ef] p-3">
                            <p className="text-[8px] uppercase tracking-wider text-black/35">
                              Offers
                            </p>

                            <p className="mt-1 text-xl font-semibold">
                              03
                            </p>
                          </div>
                        </div>

                        {/* mini chart */}
                        <div className="mt-3 rounded-2xl bg-white p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[8px] font-medium uppercase tracking-[0.13em] text-black/25">
                                Weekly activity
                              </p>

                              <p className="mt-1 text-xs font-semibold">
                                Consistent progress
                              </p>
                            </div>

                            <TrendingUp
                              size={14}
                              className="text-[#7168c2]"
                            />
                          </div>

                          <div className="mt-4 flex h-14 items-end gap-1.5">
                            {[28, 42, 35, 58, 46, 73, 55, 82].map(
                              (height, index) => (
                                <div
                                  key={index}
                                  className="flex-1 rounded-t-md bg-[#bdb7fa]"
                                  style={{
                                    height: `${height}%`,
                                  }}
                                />
                              )
                            )}
                          </div>
                        </div>

                        {/* actions */}
                        <div className="mt-3 rounded-2xl bg-white p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-[10px] font-semibold">
                              Today's focus
                            </p>

                            <BarChart3
                              size={13}
                              className="text-black/30"
                            />
                          </div>

                          {[
                            "Follow up with Microsoft",
                            "Prepare Adobe interview",
                            "Review skill gaps",
                          ].map((item, index) => (
                            <div
                              key={item}
                              className="mb-1.5 flex items-center gap-2 rounded-lg bg-[#f7f7f8] px-2.5 py-2"
                            >
                              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#e8e5ff] text-[8px] font-semibold">
                                {index + 1}
                              </div>

                              <p className="text-[9px] font-medium text-black/60">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating card */}
                  <div className="floating-card absolute -left-1 top-8 rounded-2xl border border-white/10 bg-white p-3 text-[#101423] shadow-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ece9ff] text-[#655db2]">
                        <BrainCircuit size={15} />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold">
                          AI match
                        </p>

                        <p className="text-sm font-semibold">
                          91%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating green card */}
                  <div className="floating-card-delay absolute -bottom-1 right-0 rounded-2xl border border-[#23d391]/20 bg-[#0e211d] p-3 text-white shadow-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#23d391]/10 text-[#42dda3]">
                        <Check size={15} />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold">
                          Next step
                        </p>

                        <p className="text-[9px] text-white/40">
                          Interview tomorrow
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[10px] text-white/30">
                  <span>Application tracking</span>

                  <span>AI career tools</span>

                  <span>Productivity</span>
                </div>
              </div>
            </section>

            {/* ==================================================
                RIGHT LOGIN AREA
            ================================================== */}
            <section className="relative flex min-h-[720px] items-center justify-center overflow-hidden bg-[#fafafa] px-6 py-12 sm:px-10 lg:px-14">

              {/* subtle purple corner glow */}
              <div
                className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full opacity-50 blur-[100px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(144,134,231,0.3), transparent 70%)",
                }}
              />

              <div className="relative z-10 w-full max-w-md">

                {/* logo for mobile */}
                <div className="mb-10 lg:hidden">
                  <Link to="/" className="inline-flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1026] text-white">
                      <Zap size={16} />
                    </div>

                    <span className="text-xl font-semibold tracking-[-0.04em]">
                      JobTrack
                    </span>
                  </Link>
                </div>

                {/* Intro */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#23af79]">
                    Your workspace awaits
                  </p>

                  <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#101423] sm:text-5xl">
                    Welcome
                    <br />
                    back to
                    <br />
                    <span className="text-[#7770c7]">
                      JobTrack.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-sm text-sm leading-6 text-black/45">
                    Sign in to pick up where you left off.
                  </p>
                </div>

                {/* Login card */}
                <div className="mt-9 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,20,40,0.06)] sm:p-7">

                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-700">
                        {error}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-[#101423]"
                      >
                        Email address
                      </label>

                      <div className="group relative">
                        <Mail
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25 transition group-focus-within:text-[#7168c2]"
                        />

                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="w-full rounded-2xl border border-black/10 bg-[#fafafa] py-3.5 pl-11 pr-4 text-sm text-[#101423] outline-none transition focus:border-[#8e87dc] focus:bg-white focus:ring-4 focus:ring-[#8e87dc]/10"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="text-sm font-semibold text-[#101423]"
                        >
                          Password
                        </label>

                        <span className="text-xs text-black/30">
                          Your account password
                        </span>
                      </div>

                      <div className="group relative">
                        <LockKeyhole
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25 transition group-focus-within:text-[#7168c2]"
                        />

                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="w-full rounded-2xl border border-black/10 bg-[#fafafa] py-3.5 pl-11 pr-12 text-sm text-[#101423] outline-none transition focus:border-[#8e87dc] focus:bg-white focus:ring-4 focus:ring-[#8e87dc]/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => !prev)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 transition hover:text-black/70"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0a1026] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign in to JobTrack

                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0a1026] transition group-hover:translate-x-1">
                            <ArrowRight size={14} />
                          </span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Features */}
                  <div className="mt-6 border-t border-black/5 pt-5">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30">
                      Your workspace includes
                    </p>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        "Application tracking",
                        "AI career analysis",
                        "Interview preparation",
                        "Follow-up management",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-xs text-black/50"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f8ef] text-[#23a976]">
                            <Check size={11} />
                          </span>

                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Register */}
                <p className="mt-7 text-center text-sm text-black/40">
                  Don't have an account?
                  <Link
                    to="/register"
                    className="ml-1 font-semibold text-[#655db2] hover:text-[#4f479e]"
                  >
                    Create one
                  </Link>
                </p>

                {/* Back */}
                <div className="mt-5 text-center">
                  <Link
                    to="/"
                    className="text-xs font-medium text-black/30 transition hover:text-black/60"
                  >
                    ← Back to JobTrack
                  </Link>
                </div>

              </div>
            </section>
          </div>
        </main>

        {/* Footer note */}
        <footer className="px-5 pb-6 text-center">
          <p className="text-[11px] text-black/25">
            JobTrack · Keep your career organized.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Login;