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
  User,
  Zap,
  Target,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password
      );

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#101423]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .register-page {
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

        .register-page {
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

      <div className="register-page min-h-screen">
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
              Already have an account?
              <Link
                to="/login"
                className="ml-1.5 font-semibold text-[#0a1026] transition hover:text-[#6d65c7]"
              >
                Log in
              </Link>
            </div>
          </div>
        </header>

        {/* ==================================================
            MAIN
        ================================================== */}
        <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-8 md:px-6 md:py-12">
          <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-black/10 bg-white shadow-[0_30px_100px_rgba(15,20,40,0.08)] lg:grid-cols-[0.95fr_1.05fr]">

            {/* ==================================================
                LEFT REGISTER FORM
            ================================================== */}
            <section className="relative flex min-h-[720px] items-center justify-center overflow-hidden bg-[#fafafa] px-6 py-12 sm:px-10 lg:px-14">

              {/* subtle purple glow */}
              <div
                className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full opacity-50 blur-[100px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(144,134,231,0.32), transparent 70%)",
                }}
              />

              <div
                className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full opacity-40 blur-[100px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(153,57,99,0.15), transparent 70%)",
                }}
              />

              <div className="relative z-10 w-full max-w-md">

                {/* Mobile logo */}
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
                    Start your workspace
                  </p>

                  <h1 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#101423] sm:text-5xl">
                    Build a better
                    <br />
                    job search with
                    <br />
                    <span className="text-[#7770c7]">
                      JobTrack.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-sm text-sm leading-6 text-black/45">
                    Create your workspace and keep every application,
                    interview and follow-up organized from day one.
                  </p>
                </div>

                {/* Register card */}
                <div className="mt-9 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,20,40,0.06)] sm:p-7">

                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-700">
                        {error}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Full name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-[#101423]"
                      >
                        Full name
                      </label>

                      <div className="group relative">
                        <User
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25 transition group-focus-within:text-[#7168c2]"
                        />

                        <input
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          autoComplete="name"
                          required
                          className="w-full rounded-2xl border border-black/10 bg-[#fafafa] py-3.5 pl-11 pr-4 text-sm text-[#101423] outline-none transition focus:border-[#8e87dc] focus:bg-white focus:ring-4 focus:ring-[#8e87dc]/10"
                        />
                      </div>
                    </div>

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
                          name="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                          required
                          className="w-full rounded-2xl border border-black/10 bg-[#fafafa] py-3.5 pl-11 pr-4 text-sm text-[#101423] outline-none transition focus:border-[#8e87dc] focus:bg-white focus:ring-4 focus:ring-[#8e87dc]/10"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-[#101423]"
                      >
                        Password
                      </label>

                      <div className="group relative">
                        <LockKeyhole
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25 transition group-focus-within:text-[#7168c2]"
                        />

                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          autoComplete="new-password"
                          required
                          minLength={6}
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

                      <div className="mt-2 flex items-center gap-2">
                        <div
                          className={`h-1.5 flex-1 overflow-hidden rounded-full bg-black/5 ${
                            formData.password.length >= 6
                              ? "bg-[#e7f8ef]"
                              : ""
                          }`}
                        >
                          <div
                            className={`h-full rounded-full transition-all ${
                              formData.password.length >= 6
                                ? "w-full bg-[#23af79]"
                                : formData.password.length >= 3
                                ? "w-1/2 bg-[#aaa3ff]"
                                : "w-1/4 bg-black/15"
                            }`}
                          />
                        </div>

                        <span className="text-[10px] text-black/35">
                          {formData.password.length >= 6
                            ? "Good"
                            : "6+ characters"}
                        </span>
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
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create your JobTrack

                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0a1026] transition group-hover:translate-x-1">
                            <ArrowRight size={14} />
                          </span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Benefits */}
                  <div className="mt-6 border-t border-black/5 pt-5">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30">
                      What you get
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

                {/* Login */}
                <p className="mt-7 text-center text-sm text-black/40">
                  Already have an account?

                  <Link
                    to="/login"
                    className="ml-1 font-semibold text-[#655db2] hover:text-[#4f479e]"
                  >
                    Log in
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

            {/* ==================================================
                RIGHT PRODUCT AREA
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
                    Build your career workspace
                  </div>

                  <h2 className="mt-8 max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] xl:text-6xl">
                    One place for
                    <br />
                    every
                    <br />
                    <span className="text-[#aaa3ff]">
                      opportunity.
                    </span>
                  </h2>

                  <p className="mt-6 max-w-lg text-sm leading-6 text-white/45">
                    Organize the entire journey — applications, recruiters,
                    interviews, follow-ups and AI-powered preparation.
                  </p>
                </div>

                {/* Product visual */}
                <div className="relative mt-12 min-h-[330px]">

                  {/* main visual */}
                  <div className="absolute left-1/2 top-1/2 w-full max-w-[470px] -translate-x-1/2 -translate-y-1/2">
                    <div className="rounded-[1.8rem] border border-white/10 bg-white/10 p-2 backdrop-blur-xl">
                      <div className="rounded-[1.45rem] bg-[#f7f7f9] p-4 text-[#101423]">

                        {/* top */}
                        <div className="flex items-center justify-between border-b border-black/5 pb-4">
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/30">
                              Career workspace
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              Everything in one place
                            </p>
                          </div>

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#101423] text-white">
                            <Zap size={13} />
                          </div>
                        </div>

                        {/* feature cards */}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-xl bg-[#101423] p-3 text-white">
                            <Target size={14} className="text-[#aaa3ff]" />

                            <p className="mt-3 text-[10px] font-semibold">
                              Track
                            </p>

                            <p className="mt-1 text-[8px] text-white/40">
                              Applications & status
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#eeeaff] p-3">
                            <BrainCircuit
                              size={14}
                              className="text-[#655db2]"
                            />

                            <p className="mt-3 text-[10px] font-semibold">
                              Analyze
                            </p>

                            <p className="mt-1 text-[8px] text-black/35">
                              Resume & job match
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="rounded-xl bg-[#e8f8ef] p-3">
                            <BarChart3
                              size={14}
                              className="text-[#23a976]"
                            />

                            <p className="mt-3 text-[10px] font-semibold">
                              Measure
                            </p>

                            <p className="mt-1 text-[8px] text-black/35">
                              Career analytics
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#ffe9ef] p-3">
                            <Check
                              size={14}
                              className="text-[#bb688c]"
                            />

                            <p className="mt-3 text-[10px] font-semibold">
                              Progress
                            </p>

                            <p className="mt-1 text-[8px] text-black/35">
                              Follow-ups & interviews
                            </p>
                          </div>
                        </div>

                        {/* bottom line */}
                        <div className="mt-3 rounded-xl bg-white p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[9px] font-semibold">
                              Next step
                            </p>

                            <span className="rounded-full bg-[#e8f8ef] px-2 py-1 text-[8px] font-medium text-[#20986d]">
                              Ready
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-black/5">
                              <div className="h-full w-[78%] rounded-full bg-[#23af79]" />
                            </div>

                            <span className="text-[8px] text-black/30">
                              78%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* floating AI */}
                  <div className="floating-card absolute -left-1 top-8 rounded-2xl border border-white/10 bg-white p-3 text-[#101423] shadow-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ece9ff] text-[#655db2]">
                        <BrainCircuit size={15} />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold">
                          AI ready
                        </p>

                        <p className="text-[9px] text-black/35">
                          Analyze your next role
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* floating secure */}
                  <div className="floating-card-delay absolute -bottom-1 right-0 rounded-2xl border border-[#23d391]/20 bg-[#0e211d] p-3 text-white shadow-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#23d391]/10 text-[#42dda3]">
                        <Check size={15} />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold">
                          Workspace ready
                        </p>

                        <p className="text-[9px] text-white/40">
                          Start tracking today
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* bottom */}
                <div className="border-t border-white/10 pt-5">
                  <div className="grid grid-cols-3 gap-4 text-[10px] text-white/35">
                    <div>
                      <p className="text-white/70">01</p>
                      <p className="mt-1">Track</p>
                    </div>

                    <div>
                      <p className="text-white/70">02</p>
                      <p className="mt-1">Analyze</p>
                    </div>

                    <div>
                      <p className="text-white/70">03</p>
                      <p className="mt-1">Improve</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-5 pb-6 text-center">
          <p className="text-[11px] text-black/25">
            JobTrack · Keep your career organized.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Register;