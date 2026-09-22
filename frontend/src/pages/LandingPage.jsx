import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BellRing,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const problems = [
  {
    number: "01",
    title: "The spreadsheet chaos",
    description:
      "Applications get scattered across spreadsheets, notes and browser tabs. You lose track of where you applied and what needs attention.",
    type: "chaos",
  },
  {
    number: "02",
    title: "The follow-up gap",
    description:
      "An interview goes well, then days pass. JobTrack keeps follow-ups, interview dates and recruiter details visible.",
    type: "followup",
  },
  {
    number: "03",
    title: "Unprepared interviews",
    description:
      "Instead of opening ten different tools, use your application context and AI assistant to prepare for the next conversation.",
    type: "interview",
  },
];

const featureCards = [
  {
    icon: BellRing,
    title: "Smart follow-ups",
    description:
      "Keep upcoming and overdue follow-ups visible so important conversations do not disappear.",
    items: [
      "Google — follow up tomorrow",
      "Microsoft — recruiter reply",
      "Adobe — thank-you note",
    ],
  },
  {
    icon: BrainCircuit,
    title: "AI career analysis",
    description:
      "Understand how your resume matches a job and identify the skills you should improve.",
    items: [
      "Resume ↔ job matching",
      "Skill gap analysis",
      "Interview preparation",
    ],
  },
];

const stats = [
  { value: "01", label: "workspace for your job search" },
  { value: "AI", label: "career analysis built in" },
  { value: "∞", label: "applications you can organize" },
];

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState(0);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProblem((prev) => (prev + 1) % problems.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="jobtrack-site min-h-screen overflow-x-hidden bg-[#f7f7f8] text-[#101423]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .jobtrack-site {
          font-family: "Inter", sans-serif;
        }

        @keyframes softFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.65;
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .float-card {
          animation: softFloat 5s ease-in-out infinite;
        }

        .float-card-delay {
          animation: softFloat 6s ease-in-out infinite;
          animation-delay: 1s;
        }

        .glow-animation {
          animation: pulseGlow 7s ease-in-out infinite;
        }

        .feature-progress {
          animation: progress 4s linear;
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-black/10 bg-white/90 px-5 py-3 shadow-sm backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a1026] text-white">
              <Zap size={14} />
            </div>

            <span className="text-lg font-semibold tracking-[-0.04em]">
              JobTrack
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#problem"
              className="text-sm font-medium text-black/55 transition hover:text-black"
            >
              Why JobTrack
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-black/55 transition hover:text-black"
            >
              Features
            </a>

            <a
              href="#ai"
              className="text-sm font-medium text-black/55 transition hover:text-black"
            >
              AI
            </a>

            <a
              href="#workflow"
              className="text-sm font-medium text-black/55 transition hover:text-black"
            >
              Workflow
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/5"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="rounded-full bg-[#0a1026] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Sign up free
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="mx-4 mt-2 rounded-3xl border border-black/10 bg-white p-5 shadow-xl md:hidden">
            <div className="flex flex-col gap-5">
              <a href="#problem" onClick={closeMenu}>
                Why JobTrack
              </a>

              <a href="#features" onClick={closeMenu}>
                Features
              </a>

              <a href="#ai" onClick={closeMenu}>
                AI
              </a>

              <a href="#workflow" onClick={closeMenu}>
                Workflow
              </a>

              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-full bg-[#0a1026] px-5 py-3 text-center font-semibold text-white"
              >
                Sign up free
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =====================================================
            HERO — USER'S PURPLE / BLACK BACKGROUND
        ====================================================== */}
        <section className="relative mx-4 mt-4 overflow-hidden rounded-[2.5rem] bg-black text-white md:mx-6 lg:mx-auto lg:max-w-[1400px]">
          {/* top-right purple glow */}
          <div
            className="glow-animation pointer-events-none absolute -right-20 -top-40 h-[650px] w-[650px] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(113,105,205,0.65) 0%, rgba(76,70,147,0.35) 38%, transparent 72%)",
            }}
          />

          {/* bottom-left pink glow */}
          <div
            className="glow-animation pointer-events-none absolute -bottom-48 -left-32 h-[650px] w-[650px] rounded-full blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, rgba(153,57,99,0.45) 0%, rgba(88,34,65,0.25) 38%, transparent 72%)",
            }}
          />

          {/* center atmosphere */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[850px] -translate-x-1/2 -translate-y-1/2 blur-[130px]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(103,95,173,0.15), transparent 70%)",
            }}
          />

          <div className="relative z-10 px-6 pb-20 pt-24 md:px-12 md:pb-28 md:pt-32 lg:px-20">
            <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 backdrop-blur">
                  <Sparkles size={13} />
                  Career management, reimagined
                </div>

                <h1 className="max-w-3xl text-[3.7rem] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[4.8rem] lg:text-[6rem]">
                  Job hunting is
                  <br />
                  <span className="text-[#aaa3ff]">hard enough.</span>
                  <br />
                  Your workflow
                  <br />
                  shouldn't be.
                </h1>

                <p className="mt-8 max-w-xl text-base leading-7 text-white/55 md:text-lg">
                  Track applications, manage interviews, follow up with
                  recruiters and use AI to make every step of your job search
                  more organized.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="group flex items-center gap-3 rounded-full bg-white px-6 py-3.5 font-semibold text-[#0a1026] transition hover:-translate-y-1"
                  >
                    Start tracking free

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a1026] text-white transition group-hover:translate-x-1">
                      <ArrowRight size={14} />
                    </span>
                  </Link>

                  <a
                    href="#problem"
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 font-medium text-white transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    See how it works
                    <ArrowDownRight size={15} />
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-5 text-xs text-white/40">
                  <span>Free to get started</span>
                  <span>•</span>
                  <span>AI career tools</span>
                  <span>•</span>
                  <span>All in one workspace</span>
                </div>
              </div>

              {/* HERO PRODUCT VISUAL */}
              <div className="relative min-h-[530px]">
                {/* orbit circles */}
                <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
                <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

                {/* main dashboard */}
                <div className="absolute left-1/2 top-1/2 w-full max-w-[570px] -translate-x-1/2 -translate-y-1/2">
                  <div className="rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                    <div className="rounded-[1.6rem] bg-[#f8f8fa] p-4 text-[#101423]">
                      <div className="flex items-center justify-between border-b border-black/5 pb-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">
                            Overview
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            Your application pipeline
                          </p>
                        </div>

                        <div className="rounded-full bg-[#eceaff] px-3 py-1.5 text-xs font-medium text-[#655db2]">
                          This month
                        </div>
                      </div>

                      {/* stats */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-2xl bg-[#101423] p-4 text-white">
                          <p className="text-[10px] uppercase tracking-wider text-white/40">
                            Applications
                          </p>
                          <p className="mt-2 text-2xl font-semibold">24</p>
                        </div>

                        <div className="rounded-2xl bg-[#eeeaff] p-4">
                          <p className="text-[10px] uppercase tracking-wider text-black/40">
                            Interviews
                          </p>
                          <p className="mt-2 text-2xl font-semibold">08</p>
                        </div>

                        <div className="rounded-2xl bg-[#ffe9ef] p-4">
                          <p className="text-[10px] uppercase tracking-wider text-black/40">
                            Offers
                          </p>
                          <p className="mt-2 text-2xl font-semibold">03</p>
                        </div>
                      </div>

                      {/* graph */}
                      <div className="mt-3 rounded-3xl border border-black/5 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-black/30">
                              APPLICATION ACTIVITY
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              Consistent progress
                            </p>
                          </div>

                          <TrendingUp
                            size={17}
                            className="text-[#7067c1]"
                          />
                        </div>

                        <div className="mt-5 flex h-20 items-end gap-2">
                          {[30, 45, 38, 62, 48, 70, 58, 82, 74, 92].map(
                            (height, index) => (
                              <div
                                key={index}
                                className="flex-1 rounded-t-lg bg-[#bdb7fa]"
                                style={{ height: `${height}%` }}
                              />
                            )
                          )}
                        </div>
                      </div>

                      {/* application rows */}
                      <div className="mt-3 rounded-3xl bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-semibold">
                            Recent applications
                          </span>

                          <span className="text-[10px] font-medium text-black/30">
                            View all
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[
                            ["Google", "Frontend Engineer", "Interview"],
                            ["Microsoft", "Software Engineer", "Applied"],
                            ["Adobe", "Product Engineer", "Offer"],
                          ].map(([company, role, status]) => (
                            <div
                              key={company}
                              className="flex items-center justify-between rounded-xl bg-[#f7f7f8] px-3 py-2.5"
                            >
                              <div>
                                <p className="text-xs font-semibold">
                                  {company}
                                </p>

                                <p className="text-[10px] text-black/35">
                                  {role}
                                </p>
                              </div>

                              <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-medium">
                                {status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* floating AI card */}
                <div className="float-card absolute -left-1 top-20 hidden rounded-2xl border border-white/10 bg-white p-4 text-[#101423] shadow-2xl sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece9ff] text-[#655db2]">
                      <BrainCircuit size={17} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold">
                        AI match score
                      </p>
                      <p className="mt-0.5 text-lg font-semibold">91%</p>
                    </div>
                  </div>
                </div>

                {/* floating follow-up */}
                <div className="float-card-delay absolute -bottom-2 -right-2 hidden rounded-2xl bg-[#0a1026] p-4 text-white shadow-2xl sm:block">
                  <div className="flex items-center gap-3">
                    <BellRing size={18} className="text-[#aaa3ff]" />

                    <div>
                      <p className="text-xs font-semibold">
                        Follow-up tomorrow
                      </p>

                      <p className="mt-0.5 text-[10px] text-white/40">
                        Recruiter · Microsoft
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATS STRIP
        ====================================================== */}
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-black/10 bg-white md:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`p-7 md:p-9 ${
                  index !== stats.length - 1
                    ? "border-b border-black/10 md:border-b-0 md:border-r"
                    : ""
                }`}
              >
                <p className="text-3xl font-semibold tracking-[-0.05em]">
                  {stat.value}
                </p>

                <p className="mt-2 max-w-xs text-sm leading-6 text-black/45">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            WHY JOBTRACK
        ====================================================== */}
        <section
          id="problem"
          className="mx-auto max-w-7xl scroll-mt-28 px-5 py-24 md:px-8 md:py-32"
        >
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#23af79]">
                Why JobTrack
              </p>

              <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-6xl">
                Job hunting is messy.
                <br />
                <span className="text-black/35">
                  Your workflow doesn't have to be.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-base leading-7 text-black/50">
                JobTrack gives your search one organized home — from the first
                application to the final offer.
              </p>

              <div className="mt-8 flex gap-2">
                {problems.map((item, index) => (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => setActiveProblem(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeProblem === index
                        ? "w-10 bg-[#23af79]"
                        : "w-2 bg-black/15"
                    }`}
                    aria-label={`Show ${item.title}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {problems.map((problem, index) => {
                const active = activeProblem === index;

                return (
                  <button
                    key={problem.number}
                    type="button"
                    onClick={() => setActiveProblem(index)}
                    className={`w-full rounded-[2rem] border p-7 text-left transition-all duration-500 ${
                      active
                        ? "border-black/10 bg-white shadow-xl"
                        : "border-transparent bg-white/50"
                    }`}
                  >
                    <div className="grid gap-5 sm:grid-cols-[60px_1fr_auto]">
                      <span className="text-sm font-semibold text-[#23af79]">
                        {problem.number}
                      </span>

                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                          {problem.title}
                        </h3>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-black/45">
                          {problem.description}
                        </p>
                      </div>

                      <div
                        className={`hidden h-10 w-10 items-center justify-center rounded-full border sm:flex ${
                          active
                            ? "border-[#23af79] text-[#23af79]"
                            : "border-black/10 text-black/25"
                        }`}
                      >
                        <ArrowRight size={16} />
                      </div>
                    </div>

                    {active && (
                      <div className="mt-6">
                        {problem.type === "chaos" && (
                          <div className="rounded-2xl bg-[#f6f6f8] p-4">
                            {[
                              ["status??", false],
                              ["followed up?", false],
                              ["interview date", false],
                              ["Google — interview Thu", true],
                            ].map(([item, correct]) => (
                              <div
                                key={item}
                                className={`mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-xs ${
                                  correct
                                    ? "bg-[#e6f8ef] text-[#159363]"
                                    : "bg-white text-black/35"
                                }`}
                              >
                                <span>{correct ? "✓" : "×"}</span>

                                <span
                                  className={
                                    correct ? "font-medium" : "line-through"
                                  }
                                >
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {problem.type === "followup" && (
                          <div className="grid gap-3 sm:grid-cols-3">
                            {[
                              ["Today", "2 follow-ups"],
                              ["Tomorrow", "1 interview"],
                              ["This week", "4 actions"],
                            ].map(([title, subtitle]) => (
                              <div
                                key={title}
                                className="rounded-2xl bg-[#f6f6f8] p-4"
                              >
                                <p className="text-xs font-semibold">
                                  {title}
                                </p>

                                <p className="mt-1 text-[11px] text-black/40">
                                  {subtitle}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {problem.type === "interview" && (
                          <div className="rounded-2xl bg-[#f6f6f8] p-4">
                            <div className="grid gap-2">
                              {[
                                "Why are you interested in this role?",
                                "Explain your most relevant project.",
                                "What would you improve in the system?",
                              ].map((question) => (
                                <div
                                  key={question}
                                  className="rounded-xl bg-white px-4 py-3 text-xs text-black/60"
                                >
                                  {question}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            PIPELINE SECTION
        ====================================================== */}
        <section className="border-y border-black/10 bg-[#f4f4f6]">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
            <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#23af79]">
                  Application pipeline
                </p>

                <h2 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-6xl">
                  Your pipeline,
                  <br />
                  <span className="text-black/35">
                    at a glance.
                  </span>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-6 text-black/50">
                  Move applications from applied to interview to offer while
                  keeping the details around each opportunity close at hand.
                </p>
              </div>

              <Link
                to="/dashboard"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0a1026] px-5 py-3 text-sm font-semibold text-white"
              >
                Open dashboard
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* pipeline board */}
            <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white p-4 md:p-6">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  {
                    title: "Applied",
                    count: "12",
                    jobs: ["Microsoft", "Deloitte", "Atlassian"],
                  },
                  {
                    title: "Interview",
                    count: "05",
                    jobs: ["Google", "Adobe", "Razorpay"],
                  },
                  {
                    title: "Offer",
                    count: "02",
                    jobs: ["Startup A", "Company B"],
                  },
                  {
                    title: "Selected",
                    count: "01",
                    jobs: ["Product Company"],
                  },
                ].map((column) => (
                  <div
                    key={column.title}
                    className="rounded-2xl bg-[#f7f7f8] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {column.title}
                      </p>

                      <span className="text-xs text-black/35">
                        {column.count}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      {column.jobs.map((job) => (
                        <div
                          key={job}
                          className="rounded-xl border border-black/5 bg-white px-3 py-3"
                        >
                          <p className="text-xs font-medium">{job}</p>

                          <div className="mt-2 h-1 rounded-full bg-[#23af79]/15">
                            <div className="h-full w-[68%] rounded-full bg-[#23af79]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            AI SECTION
        ====================================================== */}
        <section
          id="ai"
          className="mx-auto max-w-7xl scroll-mt-28 px-5 py-24 md:px-8 md:py-32"
        >
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#23af79]">
                AI career assistant
              </p>

              <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-6xl">
                More context.
                <br />
                <span className="text-black/35">
                  Better preparation.
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-base leading-7 text-black/50">
                JobTrack's AI tools help you analyze a job description, compare
                your resume, find skill gaps and prepare for interviews.
              </p>

              <Link
                to="/ai-analyzer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0a1026] px-5 py-3 text-sm font-semibold text-white"
              >
                Open AI assistant
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* AI visual */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-[#dad5ff] opacity-40 blur-3xl" />

              <div className="relative rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_25px_80px_rgba(20,25,50,0.12)] md:p-7">
                <div className="flex items-center justify-between border-b border-black/5 pb-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30">
                      Match analysis
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      Frontend Engineer
                    </p>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#d8d3ff] text-lg font-semibold">
                    91%
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ["React", "Strong match", "92%"],
                    ["Node.js", "Strong match", "86%"],
                    ["System Design", "Skill gap", "48%"],
                    ["Communication", "Good match", "76%"],
                  ].map(([skill, status, value]) => (
                    <div
                      key={skill}
                      className="rounded-2xl bg-[#f7f7f8] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{skill}</p>

                        <span
                          className={`text-xs font-medium ${
                            status === "Skill gap"
                              ? "text-[#bd698f]"
                              : "text-[#23af79]"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="mt-3 h-2 rounded-full bg-black/5">
                        <div
                          className={`h-full rounded-full ${
                            status === "Skill gap"
                              ? "bg-[#dc9bb8]"
                              : "bg-[#7f77d4]"
                          }`}
                          style={{ width: value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-[#0a1026] p-5 text-white">
                  <div className="flex gap-3">
                    <Sparkles
                      size={18}
                      className="mt-0.5 text-[#aaa3ff]"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        AI recommendation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/45">
                        Strengthen system design and scalable backend concepts
                        before your next interview.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            THREE FEATURE CARDS — INSPIRED BY VIDEO
        ====================================================== */}
        <section
          id="features"
          className="scroll-mt-28 border-y border-black/10 bg-[#f4f4f6]"
        >
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
            <div className="mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#23af79]">
                Everything in one place
              </p>

              <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-6xl">
                Everything between
                <br />
                <span className="text-black/35">
                  “applied” and “hired”.
                </span>
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {featureCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className={`rounded-[2rem] border p-7 ${
                      index === 1
                        ? "border-transparent bg-[#0a1026] text-white"
                        : "border-black/10 bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        index === 1
                          ? "bg-white/10 text-[#aaa3ff]"
                          : "bg-[#eafaf2] text-[#23af79]"
                      }`}
                    >
                      <Icon size={19} />
                    </div>

                    <h3 className="mt-7 text-2xl font-semibold tracking-[-0.04em]">
                      {card.title}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-6 ${
                        index === 1 ? "text-white/45" : "text-black/45"
                      }`}
                    >
                      {card.description}
                    </p>

                    <div className="mt-6 space-y-2">
                      {card.items.map((item) => (
                        <div
                          key={item}
                          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs ${
                            index === 1
                              ? "bg-white/5 text-white/65"
                              : "bg-[#f7f7f8] text-black/55"
                          }`}
                        >
                          <Check
                            size={13}
                            className={
                              index === 1
                                ? "text-[#23af79]"
                                : "text-[#23af79]"
                            }
                          />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div
                      className={`mt-7 h-px ${
                        index === 1 ? "bg-white/10" : "bg-black/10"
                      }`}
                    />

                    <div
                      className={`mt-5 flex items-center justify-between text-xs font-semibold ${
                        index === 1 ? "text-white" : "text-black"
                      }`}
                    >
                      <span>
                        {index === 0
                          ? "Stay organized"
                          : "Prepare smarter"}
                      </span>

                      <ChevronRight size={15} />
                    </div>
                  </div>
                );
              })}

              {/* result card */}
              <div className="rounded-[2rem] bg-[#e8e5ff] p-7 lg:col-span-3">
                <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6f67bd]">
                      The result
                    </p>

                    <h3 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
                      A calmer, more visible job search.
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
                      Know what you applied to, what needs attention, which
                      interviews are coming up and where your skills need work.
                    </p>
                  </div>

                  <Link
                    to="/register"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0a1026] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Start tracking
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKFLOW
        ====================================================== */}
        <section
          id="workflow"
          className="mx-auto max-w-7xl scroll-mt-28 px-5 py-24 md:px-8 md:py-32"
        >
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#23af79]">
                Simple workflow
              </p>

              <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-6xl">
                One tracker.
                <br />
                <span className="text-black/35">
                  Every important moment.
                </span>
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  num: "01",
                  title: "Add the opportunity",
                  text: "Save the company, position, job URL, recruiter and notes.",
                  link: "#features",
                  icon: FileText,
                },
                {
                  num: "02",
                  title: "Manage the next step",
                  text: "Track status, interviews, follow-ups, email and calendar actions.",
                  link: "#problem",
                  icon: CalendarDays,
                },
                {
                  num: "03",
                  title: "Improve your chances",
                  text: "Use AI analysis, skill gaps and analytics to make better decisions.",
                  link: "#ai",
                  icon: TrendingUp,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.num}
                    className="group rounded-[2rem] border border-black/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0f0f4] text-black/60">
                        <Icon size={18} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold text-[#23af79]">
                              {item.num}
                            </p>

                            <h3 className="mt-1 text-lg font-semibold">
                              {item.title}
                            </h3>
                          </div>

                          <a
                            href={item.link}
                            className="rounded-full border border-black/10 p-2 transition group-hover:border-black/20"
                          >
                            <ArrowRight size={15} />
                          </a>
                        </div>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            DARK CTA — USER'S BACKGROUND + VIDEO STYLE
        ====================================================== */}
        <section className="mx-4 overflow-hidden rounded-[2.5rem] bg-black text-white md:mx-6 lg:mx-auto lg:max-w-[1400px]">
          <div className="relative overflow-hidden px-6 py-20 md:px-16 md:py-28">
            {/* purple */}
            <div
              className="absolute -right-20 -top-40 h-[620px] w-[620px] rounded-full blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(112,103,203,0.55) 0%, rgba(69,65,130,0.25) 40%, transparent 72%)",
              }}
            />

            {/* teal/green borrowed from video, but subtle */}
            <div
              className="absolute -bottom-48 -left-32 h-[600px] w-[600px] rounded-full blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(30,154,112,0.28) 0%, rgba(15,69,60,0.15) 40%, transparent 72%)",
              }}
            />

            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#23af79]/30 bg-[#23af79]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#68e4ae]">
                <Sparkles size={13} />
                Start tracking free · no credit card
              </div>

              <h2 className="text-5xl font-semibold leading-[0.94] tracking-[-0.06em] md:text-6xl">
                Start tracking free.
                <br />
                <span className="text-[#aaa3ff]">
                  Land your next offer sooner.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/45 md:text-base">
                Set up your job search workspace and keep every application,
                interview and follow-up in one place.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/register"
                  className="group flex items-center gap-3 rounded-full bg-[#23d391] px-6 py-3.5 font-semibold text-[#071b16] transition hover:-translate-y-1"
                >
                  Sign up free

                  <span className="transition group-hover:translate-x-1">
                    <ArrowRight size={16} />
                  </span>
                </Link>

                <Link
                  to="/login"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3.5 font-medium text-white/80 transition hover:bg-white/10"
                >
                  Log in
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap justify-center gap-5 text-xs text-white/35">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} />
                  Secure account
                </span>

                <span>•</span>

                <span>AI career tools</span>

                <span>•</span>

                <span>Application tracking</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER — INSPIRED BY VIDEO
      ====================================================== */}
      <footer className="mt-16 bg-[#080d22] text-white">
        <div className="mx-auto max-w-7xl px-5 pb-6 pt-16 md:px-8 md:pt-20">
          <div className="grid gap-12 md:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr]">
            {/* brand */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#080d22]">
                  <Zap size={14} />
                </div>

                <span className="text-lg font-semibold tracking-[-0.03em]">
                  JobTrack
                </span>
              </div>

              <p className="mt-6 max-w-sm text-sm leading-6 text-white/45">
                The calm command center for your job search — every application
                tracked, every interview prepared.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
                <span className="h-2 w-2 rounded-full bg-[#23d391]" />
                All systems operational
              </div>
            </div>

            {/* product */}
            <div>
              <p className="text-sm font-semibold text-white">
                Product
              </p>

              <div className="mt-5 space-y-3 text-sm text-white/45">
                <a href="#features" className="block hover:text-white">
                  Features
                </a>

                <a href="#ai" className="block hover:text-white">
                  AI Assistant
                </a>

                <a href="#workflow" className="block hover:text-white">
                  Workflow
                </a>

                <a href="#problem" className="block hover:text-white">
                  Why JobTrack
                </a>
              </div>
            </div>

            {/* account */}
            <div>
              <p className="text-sm font-semibold text-white">
                Account
              </p>

              <div className="mt-5 space-y-3 text-sm text-white/45">
                <Link to="/login" className="block hover:text-white">
                  Log in
                </Link>

                <Link to="/register" className="block hover:text-white">
                  Sign up
                </Link>

                <Link to="/dashboard" className="block hover:text-white">
                  Dashboard
                </Link>

                <Link
                  to="/ai-analyzer"
                  className="block hover:text-white"
                >
                  AI Assistant
                </Link>
              </div>
            </div>

            {/* tools */}
            <div>
              <p className="text-sm font-semibold text-white">
                Workspace
              </p>

              <div className="mt-5 space-y-3 text-sm text-white/45">
                <span className="block">Applications</span>
                <span className="block">Follow-ups</span>
                <span className="block">Interviews</span>
                <span className="block">Analytics</span>
              </div>
            </div>
          </div>

          {/* Giant wordmark */}
          <div className="mt-16 overflow-hidden border-t border-white/10 pt-8">
            <div className="select-none whitespace-nowrap text-[16vw] font-semibold leading-[0.75] tracking-[-0.08em] text-white/[0.035] md:text-[15vw]">
              JOBTRACK
            </div>
          </div>

          {/* footer bottom */}
          <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 text-xs text-white/35 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} JobTrack. Built for job seekers everywhere.</p>

            <Link
              to="/register"
              className="flex items-center gap-2 font-semibold text-[#42dda3] transition hover:text-[#7de8bf]"
            >
              Start tracking — Free
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;