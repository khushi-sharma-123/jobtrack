import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  BellRing,
  BrainCircuit,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  UserCircle,
  X,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductivitySummary from "../components/ProductivitySummary";
import FollowUpEmailModal from "../components/FollowUpEmailModal";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [applications, setApplications] = useState([]);

  const [analytics, setAnalytics] = useState({
    total: 0,
    responseRate: 0,
    interviewRate: 0,
    offerRate: 0,
    selectionRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingFollowUpId, setCompletingFollowUpId] =
    useState(null);

  const [selectedEmailApplication, setSelectedEmailApplication] =
    useState(null);

  const [resumeUrl, setResumeUrl] = useState("");
  const [resume, setResume] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================================================
  // Fetch applications
  // =========================================================

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/applications");

      setApplications(response.data);
    } catch (err) {
      console.error("Fetch applications error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Fetch analytics
  // =========================================================

  const fetchAnalytics = async () => {
    try {
      const response = await API.get("/applications/stats");

      setAnalytics({
        total: response.data.total || 0,
        responseRate: response.data.responseRate || 0,
        interviewRate: response.data.interviewRate || 0,
        offerRate: response.data.offerRate || 0,
        selectionRate: response.data.selectionRate || 0,
      });
    } catch (err) {
      console.error("Fetch analytics error:", err);
    }
  };

  // =========================================================
  // Fetch resume
  // =========================================================

  const fetchResume = async () => {
    try {
      const response = await API.get("/resume");

      setResumeUrl(response.data.resumeUrl || "");
    } catch (err) {
      console.error("Fetch resume error:", err);
    }
  };

  // =========================================================
  // Initial load
  // =========================================================

  useEffect(() => {
    fetchApplications();
    fetchAnalytics();
    fetchResume();
  }, []);

  // =========================================================
  // Logout
  // =========================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================================================
  // Email modal
  // =========================================================

  const handleOpenEmail = (application) => {
    setSelectedEmailApplication(application);
  };

  const handleCloseEmail = () => {
    setSelectedEmailApplication(null);
  };

  // =========================================================
  // Complete follow-up
  // =========================================================

  const handleCompleteFollowUp = async (applicationId) => {
    try {
      setCompletingFollowUpId(applicationId);
      setError("");

      const response = await API.patch(
        `/applications/${applicationId}/follow-up`,
        {
          followUpCompleted: true,
        }
      );

      const updatedApplication = response.data.application;

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? updatedApplication
            : application
        )
      );
    } catch (err) {
      console.error("Complete follow-up error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to mark follow-up as completed"
      );
    } finally {
      setCompletingFollowUpId(null);
    }
  };

  // =========================================================
  // Resume upload
  // =========================================================

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setResumeMessage(
        "Only PDF, DOC, and DOCX files are allowed"
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeMessage(
        "Resume file must be smaller than 5 MB"
      );

      e.target.value = "";
      return;
    }

    setResume(file);
    setResumeMessage("");
    setUploadingResume(true);

    try {
      const formData = new FormData();

      formData.append("resume", file);

      const response = await API.post("/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResumeUrl(response.data.resumeUrl || "");
      setResumeMessage("Resume uploaded successfully");
    } catch (err) {
      console.error("Resume upload error:", err);

      setResumeMessage(
        err.response?.data?.message ||
          "Failed to upload resume"
      );
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  };

  // =========================================================
  // Delete resume
  // =========================================================

  const handleDeleteResume = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your resume?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingResume(true);
      setResumeMessage("");

      await API.delete("/resume");

      setResumeUrl("");
      setResume(null);
      setResumeMessage("Resume deleted successfully");
    } catch (err) {
      console.error("Delete resume error:", err);

      setResumeMessage(
        err.response?.data?.message ||
          "Failed to delete resume"
      );
    } finally {
      setDeletingResume(false);
    }
  };

  // =========================================================
  // Statistics
  // =========================================================

  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const interviewCount = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const offerCount = applications.filter(
    (app) => app.status === "Offer"
  ).length;

  const selectedCount = applications.filter(
    (app) => app.status === "Selected"
  ).length;

  const activeApplications = applications.filter(
    (app) =>
      app.status !== "Rejected" &&
      app.status !== "Selected"
  ).length;

  const followUpApplications = applications.filter(
    (app) => app.followUpDate
  );

  const completedFollowUps = followUpApplications.filter(
    (app) => app.followUpCompleted
  ).length;

  const followUpCompletionRate =
    followUpApplications.length > 0
      ? Math.round(
          (completedFollowUps /
            followUpApplications.length) *
            100
        )
      : 0;

  const recentApplications = applications.slice(0, 5);

  const chartData = [
    {
      status: "Applied",
      count: appliedCount,
    },
    {
      status: "Interview",
      count: interviewCount,
    },
    {
      status: "Offer",
      count: offerCount,
    },
    {
      status: "Selected",
      count: selectedCount,
    },
    {
      status: "Rejected",
      count: rejectedCount,
    },
  ];

  const funnelData = [
    {
      stage: "Applications",
      count: totalApplications,
    },
    {
      stage: "Interviews",
      count:
        interviewCount +
        offerCount +
        selectedCount,
    },
    {
      stage: "Offers",
      count:
        offerCount +
        selectedCount,
    },
    {
      stage: "Selected",
      count: selectedCount,
    },
  ];

  // =========================================================
  // Status styles
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return {
          pill: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
        };

      case "Interview":
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
        };

      case "Offer":
        return {
          pill: "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
        };

      case "Selected":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };

      case "Rejected":
        return {
          pill: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
        };

      default:
        return {
          pill: "bg-gray-50 text-gray-700 border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#101423]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .jobtrack-dashboard {
          font-family: "Inter", sans-serif;
        }

        @keyframes dashboardEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatSoft {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.3;
          }

          50% {
            opacity: 0.52;
          }
        }

        .dashboard-enter {
          animation: dashboardEnter 0.45s ease-out;
        }

        .soft-float {
          animation: floatSoft 5s ease-in-out infinite;
        }

        .glow-pulse {
          animation: glowPulse 7s ease-in-out infinite;
        }

        .dashboard-card {
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease;
        }

        .dashboard-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 45px rgba(15, 20, 40, 0.07);
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="jobtrack-dashboard">
        {/* =====================================================
            NAVBAR
        ====================================================== */}
        <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f5f5f7]/90 backdrop-blur-xl">
          <nav className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Brand */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1026] text-white">
                  <span className="text-sm font-semibold">J</span>
                </div>

                <div>
                  <p className="text-lg font-semibold tracking-[-0.04em]">
                    JobTrack
                  </p>

                  <p className="hidden text-[9px] font-medium uppercase tracking-[0.16em] text-black/30 sm:block">
                    Career workspace
                  </p>
                </div>
              </Link>

              {/* Desktop nav */}
              <div className="hidden items-center gap-1 rounded-full border border-black/5 bg-white p-1 shadow-sm lg:flex">
                <Link
                  to="/dashboard"
                  className="rounded-full bg-[#0a1026] px-4 py-2 text-xs font-semibold text-white"
                >
                  Dashboard
                </Link>

                <Link
                  to="/applications"
                  className="rounded-full px-4 py-2 text-xs font-medium text-black/55 transition hover:bg-black/5"
                >
                  Applications
                </Link>

                <Link
                  to="/ai-analyzer"
                  className="rounded-full px-4 py-2 text-xs font-medium text-black/55 transition hover:bg-black/5"
                >
                  AI Assistant
                </Link>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-2 sm:flex">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e9e6ff] text-[#655db2]">
                    <UserCircle size={17} />
                  </div>

                  <div className="max-w-[130px]">
                    <p className="truncate text-xs font-semibold">
                      {user?.name || "User"}
                    </p>

                    <p className="truncate text-[9px] text-black/35">
                      {user?.email || "Account"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2 text-xs font-medium text-black/60 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:flex"
                >
                  <LogOut size={14} />
                  Logout
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen((prev) => !prev)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white lg:hidden"
                >
                  {mobileMenuOpen ? (
                    <X size={18} />
                  ) : (
                    <Menu size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="mt-3 rounded-2xl border border-black/10 bg-white p-3 lg:hidden">
                <div className="grid gap-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-[#0a1026] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-black/5"
                  >
                    Applications
                  </Link>

                  <Link
                    to="/ai-analyzer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-black/5"
                  >
                    AI Career Assistant
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* =====================================================
            MAIN
        ====================================================== */}
        <main className="dashboard-enter mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {/* ===================================================
              HERO HEADER
          ==================================================== */}
          <section className="relative mb-7 overflow-hidden rounded-[2.3rem] bg-[#0a1026] text-white shadow-[0_25px_80px_rgba(10,16,38,0.16)]">
            {/* Purple glow */}
            <div
              className="glow-pulse pointer-events-none absolute -right-28 -top-40 h-[520px] w-[520px] rounded-full blur-[110px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(113,105,205,0.6) 0%, rgba(76,70,147,0.25) 42%, transparent 72%)",
              }}
            />

            {/* Pink glow */}
            <div
              className="glow-pulse pointer-events-none absolute -bottom-44 -left-32 h-[430px] w-[430px] rounded-full blur-[110px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(153,57,99,0.34) 0%, rgba(88,34,65,0.15) 42%, transparent 72%)",
              }}
            />

            <div className="relative z-10 grid gap-10 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/55 backdrop-blur">
                  <Sparkles size={12} />
                  Career command center
                </div>

                <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                  {getGreeting()},{" "}
                  <span className="text-[#aaa3ff]">
                    {user?.name?.split(" ")[0] || "there"}.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
                  Here's what is happening across your job search.
                  Keep your next action visible and your momentum moving.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/applications/add"
                    className="group flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0a1026] transition hover:-translate-y-0.5"
                  >
                    <Plus size={16} />

                    Add application

                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0a1026] text-white transition group-hover:translate-x-1">
                      <ArrowRight size={12} />
                    </span>
                  </Link>

                  <Link
                    to="/ai-analyzer"
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
                  >
                    <BrainCircuit size={16} />
                    Open AI assistant
                  </Link>
                </div>
              </div>

              {/* Hero summary */}
              <div className="soft-float min-w-0 lg:w-[330px]">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        Current momentum
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {activeApplications} active opportunities
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#aaa3ff]/10 text-[#aaa3ff]">
                      <TrendingUp size={19} />
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#aaa3ff]"
                      style={{
                        width: `${Math.min(
                          analytics.responseRate,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-white/35">
                    <span>Response rate</span>
                    <span className="font-semibold text-white/65">
                      {analytics.responseRate}%
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="text-[9px] text-white/35">
                        Interviews
                      </p>
                      <p className="mt-1 text-xl font-semibold">
                        {interviewCount}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="text-[9px] text-white/35">
                        Offers
                      </p>
                      <p className="mt-1 text-xl font-semibold">
                        {offerCount}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#23d391]/10 p-3">
                      <p className="text-[9px] text-[#68e4ae]/60">
                        Selected
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#68e4ae]">
                        {selectedCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <BellRing size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ===================================================
              PRIMARY KPI ROW
          ==================================================== */}
          <section className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">

            {/* Total */}
            <div className="dashboard-card rounded-[1.6rem] border border-black/8 bg-white p-5 shadow-[0_12px_35px_rgba(15,20,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-black/30">
                    Total
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                    {totalApplications}
                  </p>

                  <p className="mt-1 text-xs text-black/35">
                    Applications
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece9ff] text-[#655db2]">
                  <Briefcase size={18} />
                </div>
              </div>
            </div>

            {/* Active */}
            <div className="dashboard-card rounded-[1.6rem] border border-black/8 bg-white p-5 shadow-[0_12px_35px_rgba(15,20,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-black/30">
                    Active pipeline
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                    {activeApplications}
                  </p>

                  <p className="mt-1 text-xs text-black/35">
                    Still in progress
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eefc] text-[#756dc7]">
                  <Activity size={18} />
                </div>
              </div>
            </div>

            {/* Interviews */}
            <div className="dashboard-card rounded-[1.6rem] border border-black/8 bg-white p-5 shadow-[0_12px_35px_rgba(15,20,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-black/30">
                    Interviews
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                    {interviewCount}
                  </p>

                  <p className="mt-1 text-xs text-black/35">
                    In your pipeline
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff4df] text-[#b47a17]">
                  <CalendarDays size={18} />
                </div>
              </div>
            </div>

            {/* Selected */}
            <div className="dashboard-card rounded-[1.6rem] border border-[#23d391]/20 bg-[#f2fbf7] p-5 shadow-[0_12px_35px_rgba(35,211,145,0.05)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#23946d]/60">
                    Selected
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#157753]">
                    {selectedCount}
                  </p>

                  <p className="mt-1 text-xs text-[#218c68]/60">
                    Career wins
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#23a976] shadow-sm">
                  <CheckCircle2 size={18} />
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================
              PRODUCTIVITY
          ==================================================== */}
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#23af79]">
                  Today
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                  Your productivity
                </h2>
              </div>

              <Link
                to="/applications"
                className="hidden items-center gap-1 text-xs font-semibold text-black/40 transition hover:text-black sm:flex"
              >
                View applications
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_15px_50px_rgba(15,20,40,0.05)]">
              <ProductivitySummary
                applications={applications}
                onOpenApplication={(applicationId) =>
                  navigate(`/applications/${applicationId}`)
                }
                onOpenEmail={handleOpenEmail}
                onCompleteFollowUp={handleCompleteFollowUp}
                onViewApplications={() =>
                  navigate("/applications")
                }
              />
            </div>
          </section>

          {/* ===================================================
              ANALYTICS HEADER
          ==================================================== */}
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#23af79]">
                  Performance
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                  Career analytics
                </h2>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-[10px] text-black/40 sm:flex">
                <BarChart3 size={13} />
                Based on your applications
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

              {/* Response */}
              <div className="dashboard-card rounded-[1.6rem] border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">
                    Response
                  </span>

                  <TrendingUp size={17} className="text-[#7168c2]" />
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
                  {analytics.responseRate}%
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eeecf7]">
                  <div
                    className="h-full rounded-full bg-[#8178d1]"
                    style={{
                      width: `${Math.min(
                        analytics.responseRate,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] text-black/35">
                  Applications receiving a response
                </p>
              </div>

              {/* Interview */}
              <div className="dashboard-card rounded-[1.6rem] border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">
                    Interview
                  </span>

                  <Target size={17} className="text-[#b27a16]" />
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
                  {analytics.interviewRate}%
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#f5ecd9]">
                  <div
                    className="h-full rounded-full bg-[#d19b3b]"
                    style={{
                      width: `${Math.min(
                        analytics.interviewRate,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] text-black/35">
                  Applications reaching interview
                </p>
              </div>

              {/* Offer */}
              <div className="dashboard-card rounded-[1.6rem] border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">
                    Offer
                  </span>

                  <Award size={17} className="text-[#8064c5]" />
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
                  {analytics.offerRate}%
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eee8fa]">
                  <div
                    className="h-full rounded-full bg-[#8b72d1]"
                    style={{
                      width: `${Math.min(
                        analytics.offerRate,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] text-black/35">
                  Applications reaching offer
                </p>
              </div>

              {/* Selection */}
              <div className="dashboard-card rounded-[1.6rem] border border-[#23d391]/20 bg-[#fbfffd] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#23946d]/55">
                    Selection
                  </span>

                  <CheckCircle2
                    size={17}
                    className="text-[#23a976]"
                  />
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#167957]">
                  {analytics.selectionRate}%
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dff4ea]">
                  <div
                    className="h-full rounded-full bg-[#23af79]"
                    style={{
                      width: `${Math.min(
                        analytics.selectionRate,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] text-[#278867]/55">
                  Applications resulting in selection
                </p>
              </div>

              {/* Active */}
              <div className="dashboard-card rounded-[1.6rem] border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">
                    Pipeline
                  </span>

                  <Briefcase size={17} className="text-[#7168c2]" />
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
                  {activeApplications}
                </p>

                <p className="mt-3 text-[10px] text-black/35">
                  Opportunities still in progress
                </p>
              </div>

              {/* Follow-up */}
              <div className="dashboard-card rounded-[1.6rem] border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">
                    Follow-ups
                  </span>

                  <Check size={17} className="text-[#23af79]" />
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
                  {followUpCompletionRate}%
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e6f5ee]">
                  <div
                    className="h-full rounded-full bg-[#23af79]"
                    style={{
                      width: `${Math.min(
                        followUpCompletionRate,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] text-black/35">
                  Follow-ups completed
                </p>
              </div>
            </div>
          </section>

          {/* ===================================================
              RESUME + ACTIVITY CHART
          ==================================================== */}
          <section className="mb-8 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">

            {/* Resume */}
            <div className="dashboard-card rounded-[2rem] border border-black/8 bg-white p-6 sm:p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#23af79]">
                    Career asset
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                    Your resume
                  </h2>

                  <p className="mt-1 text-xs text-black/35">
                    Keep your latest version ready for applications.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ece9ff] text-[#655db2]">
                  <FileText size={19} />
                </div>
              </div>

              {resumeUrl ? (
                <>
                  <div className="mt-6 rounded-[1.5rem] bg-[#f1fbf6] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#23a976] shadow-sm">
                        <CheckCircle2 size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#176f52]">
                          Resume ready
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-[#2c8c6c]/70">
                          {resume?.name || "Saved resume"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          resumeUrl,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs font-semibold text-black/65 transition hover:bg-black/[0.02]"
                    >
                      <Eye size={15} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteResume}
                      disabled={deletingResume}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingResume ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}

                      Delete
                    </button>
                  </div>

                  <label className="mt-2.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0a1026] px-4 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5">
                    <Upload size={15} />
                    Replace resume

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                  </label>
                </>
              ) : (
                <div className="mt-6">
                  <div className="rounded-[1.5rem] border border-dashed border-black/12 bg-[#fafafa] p-7 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ece9ff] text-[#655db2]">
                      <FileText size={21} />
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      No resume uploaded
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-black/35">
                      PDF, DOC or DOCX · maximum 5 MB
                    </p>
                  </div>

                  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0a1026] px-4 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5">
                    {uploadingResume ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={15} />
                        Upload resume
                      </>
                    )}

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                  </label>
                </div>
              )}

              {resumeMessage && (
                <p
                  className={`mt-3 text-center text-xs ${
                    resumeMessage
                      .toLowerCase()
                      .includes("success")
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {resumeMessage}
                </p>
              )}
            </div>

            {/* Activity chart */}
            <div className="dashboard-card rounded-[2rem] border border-black/8 bg-white p-6 sm:p-7">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#23af79]">
                    Application activity
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                    Where your applications stand
                  </h2>

                  <p className="mt-1 text-xs text-black/35">
                    A quick view of your current hiring pipeline.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-[#f4f3fb] px-3 py-2 text-[10px] font-medium text-[#6f67bd]">
                  <Activity size={13} />
                  Live data
                </div>
              </div>

              <div className="mt-6 h-[280px] w-full">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-xs text-black/35">
                    Loading chart...
                  </div>
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                        stroke="#ececf1"
                      />

                      <XAxis
                        dataKey="status"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: "#8b8b95",
                        }}
                      />

                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: "#8b8b95",
                        }}
                      />

                      <Tooltip
                        cursor={{
                          fill: "rgba(113,105,205,0.05)",
                        }}
                        contentStyle={{
                          borderRadius: "14px",
                          border: "1px solid #ececf1",
                          boxShadow:
                            "0 15px 35px rgba(15,20,40,0.08)",
                          fontSize: "11px",
                        }}
                      />

                      <Bar
                        dataKey="count"
                        fill="#8279d4"
                        radius={[7, 7, 0, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </section>

          {/* ===================================================
              FUNNEL + INSIGHT
          ==================================================== */}
          <section className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">

            {/* Funnel */}
            <div className="dashboard-card rounded-[2rem] border border-black/8 bg-white p-6 sm:p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#23af79]">
                    Pipeline flow
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                    Application funnel
                  </h2>

                  <p className="mt-1 text-xs text-black/35">
                    Watch opportunities move from application to selection.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1efff] text-[#7168c2]">
                  <TrendingUp size={18} />
                </div>
              </div>

              <div className="mt-5 h-[250px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={funnelData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 15,
                      left: 15,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      horizontal={false}
                      stroke="#ececf1"
                    />

                    <XAxis
                      type="number"
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fill: "#8b8b95",
                      }}
                    />

                    <YAxis
                      type="category"
                      dataKey="stage"
                      width={90}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fill: "#55555f",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #ececf1",
                        boxShadow:
                          "0 15px 35px rgba(15,20,40,0.08)",
                        fontSize: "11px",
                      }}
                    />

                    <Bar
                      dataKey="count"
                      fill="#9a91e1"
                      radius={[0, 7, 7, 0]}
                      barSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insight */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#e8e5ff] p-7">
              <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#9b91e9]/25 blur-3xl" />

              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-[#655db2]">
                  <BrainCircuit size={19} />
                </div>

                <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f67bd]">
                  JobTrack insight
                </p>

                <h3 className="mt-2 text-2xl font-semibold leading-[1.05] tracking-[-0.04em]">
                  Your dashboard should tell you what to do next.
                </h3>

                <p className="mt-4 text-sm leading-6 text-black/50">
                  Use follow-ups, interviews and AI analysis together so your
                  next action is always visible.
                </p>

                <div className="mt-7 rounded-2xl bg-white/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      Follow-up completion
                    </span>

                    <span className="text-sm font-semibold text-[#655db2]">
                      {followUpCompletionRate}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#7f77d4]"
                      style={{
                        width: `${Math.min(
                          followUpCompletionRate,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <Link
                  to="/ai-analyzer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0a1026] px-4 py-2.5 text-xs font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Explore AI assistant
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>

          {/* ===================================================
              RECENT APPLICATIONS
          ==================================================== */}
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#23af79]">
                  Latest activity
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                  Recent applications
                </h2>
              </div>

              <Link
                to="/applications"
                className="flex items-center gap-1 text-xs font-semibold text-[#7168c2] transition hover:text-[#51499d]"
              >
                View all
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_15px_50px_rgba(15,20,40,0.05)]">
              {loading ? (
                <div className="p-10 text-center text-sm text-black/35">
                  Loading applications...
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ece9ff] text-[#655db2]">
                    <Briefcase size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    Your pipeline is empty
                  </h3>

                  <p className="mt-2 text-sm text-black/40">
                    Add your first application and start building your
                    career pipeline.
                  </p>

                  <Link
                    to="/applications/add"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0a1026] px-5 py-3 text-xs font-semibold text-white"
                  >
                    <Plus size={15} />
                    Add application
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {recentApplications.map((application) => {
                    const statusStyle = getStatusStyle(
                      application.status
                    );

                    return (
                      <button
                        key={application._id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/applications/${application._id}`
                          )
                        }
                        className="group flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-[#fafafa] sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0eefc] text-sm font-semibold text-[#655db2]">
                            {application.company
                              ?.charAt(0)
                              ?.toUpperCase() || "J"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {application.position}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-black/35">
                              <span className="font-medium text-[#655db2]">
                                {application.company}
                              </span>

                              {application.location && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {application.location}
                                  </span>
                                </>
                              )}

                              {application.jobType && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {application.jobType}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${statusStyle.pill}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                            />

                            {application.status}
                          </span>

                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/8 text-black/25 transition group-hover:border-black/15 group-hover:text-black/60">
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* ===================================================
              BOTTOM ACTION STRIP
          ==================================================== */}
          <section className="mb-6 grid gap-3 sm:grid-cols-3">

            <Link
              to="/applications/add"
              className="group rounded-[1.6rem] border border-black/8 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece9ff] text-[#655db2]">
                  <Plus size={18} />
                </div>

                <ArrowRight
                  size={15}
                  className="text-black/20 transition group-hover:translate-x-1 group-hover:text-black/50"
                />
              </div>

              <p className="mt-5 text-sm font-semibold">
                Add application
              </p>

              <p className="mt-1 text-[10px] leading-5 text-black/35">
                Add a new opportunity to your pipeline.
              </p>
            </Link>

            <Link
              to="/ai-analyzer"
              className="group rounded-[1.6rem] bg-[#0a1026] p-5 text-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#aaa3ff]">
                  <BrainCircuit size={18} />
                </div>

                <ArrowRight
                  size={15}
                  className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white/70"
                />
              </div>

              <p className="mt-5 text-sm font-semibold">
                Analyze a job
              </p>

              <p className="mt-1 text-[10px] leading-5 text-white/40">
                Compare your resume and uncover skill gaps.
              </p>
            </Link>

            <Link
              to="/applications"
              className="group rounded-[1.6rem] border border-[#23d391]/20 bg-[#effbf6] p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#23a976]">
                  <Briefcase size={18} />
                </div>

                <ArrowRight
                  size={15}
                  className="text-[#23a976]/30 transition group-hover:translate-x-1 group-hover:text-[#23a976]"
                />
              </div>

              <p className="mt-5 text-sm font-semibold text-[#155e45]">
                Manage pipeline
              </p>

              <p className="mt-1 text-[10px] leading-5 text-[#278867]/55">
                Search, filter and manage every application.
              </p>
            </Link>
          </section>

          {/* Footer */}
          <footer className="pb-5 pt-4 text-center">
            <p className="text-[10px] text-black/25">
              JobTrack · Keep your career organized.
            </p>
          </footer>
        </main>

        {/* =====================================================
            EMAIL MODAL
        ====================================================== */}
        {selectedEmailApplication && (
          <FollowUpEmailModal
            application={{
              ...selectedEmailApplication,
              userName: user?.name || "",
            }}
            onClose={handleCloseEmail}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;