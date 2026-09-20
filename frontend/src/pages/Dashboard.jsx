import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Plus,
  LogOut,
  FileText,
  Upload,
  Eye,
  Trash2,
  Loader2,
  TrendingUp,
  Target,
  Award,
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
  const [completingFollowUpId, setCompletingFollowUpId] = useState(null);

  // ==========================================
  // Email modal
  // ==========================================

  const [selectedEmailApplication, setSelectedEmailApplication] =
    useState(null);

  // ==========================================
  // Resume states
  // ==========================================

  const [resumeUrl, setResumeUrl] = useState("");
  const [resume, setResume] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");

  // ==========================================
  // Fetch Applications
  // ==========================================

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

  // ==========================================
  // Fetch Analytics
  // ==========================================

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

  // ==========================================
  // Fetch Existing Resume
  // ==========================================

  const fetchResume = async () => {
    try {
      const response = await API.get("/resume");

      setResumeUrl(response.data.resumeUrl || "");
    } catch (err) {
      console.error("Fetch resume error:", err);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchApplications();
    fetchAnalytics();
    fetchResume();
  }, []);

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ==========================================
  // Email Modal
  // ==========================================

  const handleOpenEmail = (application) => {
    setSelectedEmailApplication(application);
  };

  const handleCloseEmail = () => {
    setSelectedEmailApplication(null);
  };
 
  // ==========================================
// Complete Follow-up
// ==========================================

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

    const updatedApplication =
      response.data.application;

    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application._id === applicationId
          ? updatedApplication
          : application
      )
    );
  } catch (err) {
    console.error(
      "Complete follow-up error:",
      err
    );

    setError(
      err.response?.data?.message ||
        "Failed to mark follow-up as completed"
    );
  } finally {
    setCompletingFollowUpId(null);
  }
};

  // ==========================================
  // Resume Upload
  // ==========================================

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

  // ==========================================
  // Delete Resume
  // ==========================================

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

  // ==========================================
  // Statistics
  // ==========================================

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

const activeApplications = applications.filter(
  (app) =>
    app.status !== "Rejected" &&
    app.status !== "Selected"
).length;

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

  // ==========================================
  // Application Funnel
  // ==========================================

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

  // ==========================================
  // Status Style
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Interview":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Offer":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "Selected":
        return "bg-green-50 text-green-700 border-green-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==========================================
          Navbar
      ========================================== */}

      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <Link
            to="/dashboard"
            className="text-2xl font-bold text-indigo-600"
          >
            JobTrack
          </Link>

          <div className="flex items-center gap-4">

            <Link
              to="/applications"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Applications
            </Link>

            <Link
              to="/ai-analyzer"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              AI Career Assistant
            </Link>

            <span className="hidden text-sm text-gray-500 sm:block">
              Hi, {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* ==========================================
          Main
      ========================================== */}

      <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Track your job applications and manage your job search.
            </p>
          </div>

          <Link
            to="/applications/add"
            className="flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Application
          </Link>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Main Statistics */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}

          <div className="hover-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalApplications}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50">
                <Briefcase
                  size={22}
                  className="text-indigo-600"
                />
              </div>

            </div>
          </div>

          {/* Applied */}

          <div className="hover-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Applied
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {appliedCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                <Clock
                  size={22}
                  className="text-blue-600"
                />
              </div>

            </div>
          </div>

          {/* Interviews */}

          <div className="hover-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Interviews
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {interviewCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-50">
                <Clock
                  size={22}
                  className="text-yellow-600"
                />
              </div>

            </div>
          </div>

          {/* Selected */}

          <div className="hover-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Selected
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {selectedCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle
                  size={22}
                  className="text-green-600"
                />
              </div>

            </div>
          </div>

        </div>

        {/* ==========================================
            Productivity
        ========================================== */}

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

        {/* ==========================================
            Analytics
        ========================================== */}

        <div className="mb-8">

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Application Analytics
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Understand how your applications are progressing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            {/* Response Rate */}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Response Rate
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {analytics.responseRate}%
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Applications receiving a response
                  </p>
                </div>

                <TrendingUp
                  size={25}
                  className="text-indigo-600"
                />

              </div>
            </div>

            {/* Interview Rate */}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Interview Rate
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {analytics.interviewRate}%
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Applications reaching interview
                  </p>
                </div>

                <Target
                  size={25}
                  className="text-yellow-600"
                />

              </div>
            </div>

            {/* Offer Rate */}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Offer Rate
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {analytics.offerRate}%
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Applications reaching offer
                  </p>
                </div>

                <Award
                  size={25}
                  className="text-purple-600"
                />

              </div>
            </div>

            {/* Selection Rate */}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Selection Rate
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {analytics.selectionRate}%
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Applications resulting in selection
                  </p>
                </div>

                <CheckCircle
                  size={25}
                  className="text-green-600"
                />

              </div>
            </div>

            {/* Active Pipeline */}

<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">
        Active Pipeline
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {activeApplications}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Applications still in progress
      </p>
    </div>

    <Briefcase
      size={25}
      className="text-indigo-600"
    />
  </div>
</div>

{/* Follow-up Completion */}

<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">
        Follow-up Completion
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {followUpCompletionRate}%
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Follow-ups completed
      </p>
    </div>

    <CheckCircle
      size={25}
      className="text-green-600"
    />
  </div>
</div>

          </div>
        </div>


        {/* ==========================================
            Resume + Status Chart
        ========================================== */}

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Resume */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                <FileText
                  size={21}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  My Resume
                </h2>

                <p className="text-xs text-gray-500">
                  Manage your latest resume
                </p>
              </div>

            </div>

            {resumeUrl ? (
              <>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">

                  <div className="flex items-center gap-3">

                    <CheckCircle
                      size={20}
                      className="shrink-0 text-green-600"
                    />

                    <div className="min-w-0">

                      <p className="text-sm font-medium text-green-800">
                        Resume uploaded
                      </p>

                      <p className="mt-0.5 truncate text-xs text-green-700">
                        {resume?.name || "Your saved resume"}
                      </p>

                    </div>

                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">

                  <button
                    onClick={() =>
                      window.open(
                        resumeUrl,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <button
                    onClick={handleDeleteResume}
                    disabled={deletingResume}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingResume ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>

                </div>

                <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100">

                  <Upload size={16} />
                  Replace Resume

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
              <>
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center">

                  <FileText
                    size={30}
                    className="mx-auto text-gray-400"
                  />

                  <p className="mt-2 text-sm font-medium text-gray-700">
                    No resume uploaded
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    PDF, DOC or DOCX · Max 5 MB
                  </p>

                </div>

                <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700">

                  {uploadingResume ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      Upload Resume
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
              </>
            )}

            {resumeMessage && (
              <p
                className={`mt-3 text-center text-sm ${
                  resumeMessage
                    .toLowerCase()
                    .includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {resumeMessage}
              </p>
            )}

          </div>

          {/* Status Chart */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">

            <div className="mb-5">
              <h2 className="font-semibold text-gray-900">
                Application Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Applications by current status
              </p>
            </div>

            <div className="h-72 w-full">

              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart data={chartData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="status"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      fill="#4f46e5"
                      radius={[5, 5, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>
          </div>

        </div>

        {/* ==========================================
            Application Funnel
        ========================================== */}

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="font-semibold text-gray-900">
              Application Funnel
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              See how applications move through your hiring pipeline.
            </p>
          </div>

          <div className="h-72 w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={funnelData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                />

                <YAxis
                  type="category"
                  dataKey="stage"
                  width={90}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#6366f1"
                  radius={[0, 5, 5, 0]}
                  barSize={35}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* ==========================================
            Recent Applications
        ========================================== */}

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Applications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest job applications
              </p>
            </div>

            <Link
              to="/applications"
              className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
            >
              View all
            </Link>

          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Loading applications...
            </div>
          ) : recentApplications.length === 0 ? (
            <div className="p-10 text-center">

              <Briefcase
                size={30}
                className="mx-auto text-gray-400"
              />

              <p className="mt-3 font-medium text-gray-700">
                No applications yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first application to start tracking.
              </p>

              <Link
                to="/applications/add"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <Plus size={16} />
                Add Application
              </Link>

            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {recentApplications.map((application) => (
                <button
                  key={application._id}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/applications/${application._id}`
                    )
                  }
                  className="flex w-full flex-col gap-3 px-6 py-5 text-left transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <h3 className="font-medium text-gray-900">
                      {application.position}
                    </h3>

                    <p className="mt-1 text-sm text-indigo-600">
                      {application.company}
                    </p>

                    {application.location && (
                      <p className="mt-1 text-xs text-gray-400">
                        {application.location}
                      </p>
                    )}

                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>

                </button>
              ))}

            </div>
          )}

        </div>

      </main>

      {/* ==========================================
          Follow-up Email Modal
      ========================================== */}

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
  );
}

export default Dashboard;