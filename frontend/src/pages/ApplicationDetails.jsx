import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  ExternalLink,
  MapPin,
  FileText,
  Pencil,
  Trash2,
  User,
  Mail,
  Phone,
  Save,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

import API from "../services/api";

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Recruiter & Interview Information
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterPhone, setRecruiterPhone] = useState("");
  const [recruiterLinkedin, setRecruiterLinkedin] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  const [savingInterviewInfo, setSavingInterviewInfo] =
    useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  // Calendar
  // Calendar
const [addingToCalendar, setAddingToCalendar] = useState(false);
const [calendarMessage, setCalendarMessage] = useState("");
const [calendarError, setCalendarError] = useState("");

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Timeline
  const [timeline, setTimeline] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [timelineError, setTimelineError] = useState("");

  // ==========================================
  // Fetch Application Timeline
  // ==========================================

  const fetchTimeline = async () => {
    try {
      setLoadingTimeline(true);
      setTimelineError("");

      const response = await API.get(
        `/applications/${id}/timeline`
      );

      setTimeline(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch application timeline:",
        error
      );

      setTimelineError(
        error.response?.data?.message ||
          "Failed to fetch timeline"
      );
    } finally {
      setLoadingTimeline(false);
    }
  };

  // ==========================================
  // Fetch Application
  // ==========================================

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/applications/${id}`
        );

        const data = response.data;

        setApplication(data);

        setRecruiterName(data.recruiterName || "");
        setRecruiterEmail(data.recruiterEmail || "");
        setRecruiterPhone(data.recruiterPhone || "");
        setRecruiterLinkedin(
          data.recruiterLinkedin || ""
        );
        setInterviewNotes(data.interviewNotes || "");
      } catch (error) {
        console.error(
          "Failed to fetch application:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load application details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // ==========================================
  // Fetch Timeline
  // ==========================================

  useEffect(() => {
    fetchTimeline();
  }, [id]);

  // ==========================================
  // Delete Application
  // ==========================================

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await API.delete(`/applications/${id}`);

      navigate("/applications");
    } catch (error) {
      console.error(
        "Failed to delete application:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete application"
      );

      setDeleting(false);
    }
  };

  // ==========================================
  // Save Recruiter & Interview Information
  // ==========================================

  const handleSaveInterviewInfo = async () => {
    setSavingInterviewInfo(true);
    setSaveMessage("");
    setSaveError("");

    try {
      const response = await API.patch(
        `/applications/${id}/interview`,
        {
          recruiterName: recruiterName.trim(),
          recruiterEmail: recruiterEmail.trim(),
          recruiterPhone: recruiterPhone.trim(),
          recruiterLinkedin: recruiterLinkedin.trim(),
          interviewNotes: interviewNotes.trim(),
        }
      );

      setApplication(response.data.application);

      setSaveMessage(
        "Information saved successfully."
      );

      await fetchTimeline();

      setTimeout(() => {
        setSaveMessage("");
      }, 3500);
    } catch (error) {
      console.error(
        "Failed to save recruiter/interview information:",
        error
      );

      setSaveError(
        error.response?.data?.message ||
          "Failed to save information"
      );
    } finally {
      setSavingInterviewInfo(false);
    }
  };

  // ==========================================
// Add Interview To Google Calendar
// ==========================================

const handleAddToCalendar = async () => {
  setCalendarMessage("");
  setCalendarError("");

  if (!application?.interviewDate) {
    setCalendarError(
      "Please schedule an interview date before adding it to Google Calendar."
    );
    return;
  }

  try {
    setAddingToCalendar(true);

    const response = await API.get(
      `/applications/${id}/calendar`
    );

    const calendarUrl = response.data.calendarUrl;

    if (!calendarUrl) {
      throw new Error(
        "Calendar link was not generated."
      );
    }

    // Open the actual Google Calendar URL
    window.open(
      calendarUrl,
      "_blank",
      "noopener,noreferrer"
    );

    setCalendarMessage(
      "Google Calendar opened successfully."
    );

    setTimeout(() => {
      setCalendarMessage("");
    }, 3500);
  } catch (error) {
    console.error(
      "Failed to generate calendar event:",
      error
    );

    setCalendarError(
      error.response?.data?.message ||
        error.message ||
        "Failed to add interview to Google Calendar"
    );
  } finally {
    setAddingToCalendar(false);
  }
};
  // ==========================================
  // Status Configuration
  // ==========================================

  const getStatusConfig = (status) => {
    switch (status) {
      case "Applied":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
          icon: Briefcase,
        };

      case "Interview":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-500",
          icon: Calendar,
        };

      case "Offer":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          dot: "bg-purple-500",
          icon: Sparkles,
        };

      case "Selected":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
        };

      case "Rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          dot: "bg-red-500",
          icon: AlertCircle,
        };

      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-500",
          icon: Briefcase,
        };
    }
  };

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // Format Interview Date
  // ==========================================

  const formatInterviewDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // Format Timeline Date
  // ==========================================

  const formatTimelineDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // Loading Screen
  // ==========================================

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% {
              background-position: -500px 0;
            }
            100% {
              background-position: 500px 0;
            }
          }

          .skeleton {
            background: linear-gradient(
              90deg,
              #f1f5f9 25%,
              #e2e8f0 50%,
              #f1f5f9 75%
            );
            background-size: 1000px 100%;
            animation: shimmer 1.5s infinite linear;
          }
        `}</style>

        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">

            <div className="skeleton h-5 w-36 rounded mb-8" />

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">

              <div className="h-2 bg-gray-200" />

              <div className="p-6 sm:p-8">

                <div className="flex justify-between gap-5">

                  <div className="flex gap-4">
                    <div className="skeleton w-16 h-16 rounded-2xl" />

                    <div>
                      <div className="skeleton h-7 w-64 rounded mb-3" />
                      <div className="skeleton h-4 w-36 rounded" />
                    </div>
                  </div>

                  <div className="hidden sm:flex gap-2">
                    <div className="skeleton h-10 w-20 rounded-xl" />
                    <div className="skeleton h-10 w-24 rounded-xl" />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="skeleton h-24 rounded-2xl"
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error || !application) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() =>
              navigate("/applications")
            }
            className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-7 transition-colors"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Applications
          </button>

          <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center shadow-sm">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle
                className="text-red-500"
                size={26}
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Unable to load application
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              {error || "Application not found"}
            </p>

            <button
              onClick={() =>
                navigate("/applications")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
            >
              <ArrowLeft size={16} />
              Back to Applications
            </button>

          </div>

        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(
    application.status
  );

  const StatusIcon = statusConfig.icon;

  return (
    <>
      <style>{`
        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(.94);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .55;
          }
        }

        .page-enter {
          animation: pageEnter .55s ease-out both;
        }

        .fade-up {
          animation: fadeUp .55s ease-out both;
        }

        .scale-in {
          animation: scaleIn .35s ease-out both;
        }

        .pulse-soft {
          animation: pulseSoft 2s ease-in-out infinite;
        }

        .detail-card {
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease;
        }

        .detail-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, .06);
          border-color: #e2e8f0;
        }

        .interactive-button {
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            background-color .2s ease;
        }

        .interactive-button:hover {
          transform: translateY(-1px);
        }

        .interactive-button:active {
          transform: translateY(0) scale(.98);
        }

        .input-modern {
          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            background-color .2s ease;
        }

        .input-modern:focus {
          border-color: #94a3b8;
          box-shadow: 0 0 0 4px rgba(148, 163, 184, .12);
          background: white;
        }

        .timeline-item {
          animation: fadeUp .45s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 page-enter">

        <div className="max-w-5xl mx-auto">

          {/* ==========================================
              Back Navigation
          ========================================== */}

          <button
            onClick={() =>
              navigate("/applications")
            }
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft
              size={17}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Applications
          </button>

          {/* ==========================================
              Main Container
          ========================================== */}

          <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_10px_40px_rgba(15,23,42,0.05)] overflow-hidden">

            {/* ==========================================
                Accent Line
            ========================================== */}

            <div className="h-1.5 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-400" />

            {/* ==========================================
                Hero Header
            ========================================== */}

            <div className="relative overflow-hidden border-b border-gray-100">

              {/* Background decoration */}

              <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-gray-100/70 blur-3xl pointer-events-none" />

              <div className="absolute right-24 bottom-0 w-40 h-40 rounded-full bg-slate-100/60 blur-3xl pointer-events-none" />

              <div className="relative p-6 sm:p-8 lg:p-9">

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-7">

                  {/* Company / Position */}

                  <div className="min-w-0">

                    <div className="flex items-start gap-4">

                      <div className="relative flex-shrink-0">

                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center shadow-lg shadow-gray-900/10">
                          <Building2 size={28} />
                        </div>

                        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot}`}
                          />
                        </div>

                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 break-words">
                            {application.position}
                          </h1>

                        </div>

                        <p className="text-base sm:text-lg text-gray-500 mt-1.5">
                          {application.company}
                        </p>

                        <div className="flex flex-wrap items-center gap-2.5 mt-4">

                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            <StatusIcon size={13} />
                            {application.status}
                          </span>

                          {application.jobType && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-xs font-medium">
                              <Briefcase size={13} />
                              {application.jobType}
                            </span>
                          )}

                          {application.location && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-xs font-medium">
                              <MapPin size={13} />
                              {application.location}
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Actions */}

                  <div className="flex flex-wrap gap-2 lg:flex-shrink-0">

                    <button
                      onClick={() =>
                        navigate(
                          `/applications/edit/${application._id}`
                        )
                      }
                      className="interactive-button inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:shadow-sm"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setShowDeleteModal(true)
                      }
                      className="interactive-button inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-white text-red-600 text-sm font-medium hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            </div>

            {/* ==========================================
                Content
            ========================================== */}

            <div className="p-5 sm:p-7 lg:p-9">

              {/* ==========================================
                  Quick Overview
              ========================================== */}

              <section className="fade-up">

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <h2 className="text-lg font-bold text-gray-950">
                      Application Overview
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Key information about this opportunity.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                    <Sparkles size={14} />
                    JobTrack
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {/* Location */}

                  <div className="detail-card border border-gray-200 rounded-2xl p-5 bg-white">

                    <div className="flex items-center justify-between">

                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <MapPin
                          size={18}
                          className="text-blue-600"
                        />
                      </div>

                    </div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mt-4">
                      Location
                    </p>

                    <p className="font-semibold text-gray-900 mt-1 break-words">
                      {application.location ||
                        "Not specified"}
                    </p>

                  </div>

                  {/* Job Type */}

                  <div className="detail-card border border-gray-200 rounded-2xl p-5 bg-white">

                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Briefcase
                        size={18}
                        className="text-purple-600"
                      />
                    </div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mt-4">
                      Job Type
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">
                      {application.jobType ||
                        "Not specified"}
                    </p>

                  </div>

                  {/* Applied Date */}

                  <div className="detail-card border border-gray-200 rounded-2xl p-5 bg-white">

                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Calendar
                        size={18}
                        className="text-emerald-600"
                      />
                    </div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mt-4">
                      Applied On
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">
                      {formatDate(
                        application.appliedDate
                      )}
                    </p>

                  </div>

                  {/* Follow Up */}

                  <div className="detail-card border border-gray-200 rounded-2xl p-5 bg-white">

                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Clock
                        size={18}
                        className="text-amber-600"
                      />
                    </div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mt-4">
                      Follow-up
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">
                      {application.followUpDate
                        ? formatDate(
                            application.followUpDate
                          )
                        : "Not scheduled"}
                    </p>

                  </div>

                  {/* Added */}

                  <div className="detail-card border border-gray-200 rounded-2xl p-5 bg-white">

                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <FileText
                        size={18}
                        className="text-slate-600"
                      />
                    </div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mt-4">
                      Added On
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">
                      {formatDate(
                        application.createdAt
                      )}
                    </p>

                  </div>

                  {/* Status */}

                  <div className="detail-card border border-gray-200 rounded-2xl p-5 bg-white">

                    <div
                      className={`w-10 h-10 rounded-xl ${statusConfig.bg} flex items-center justify-center`}
                    >
                      <StatusIcon
                        size={18}
                        className={statusConfig.text}
                      />
                    </div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mt-4">
                      Current Status
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">
                      {application.status}
                    </p>

                  </div>

                </div>

              </section>

              {/* ==========================================
                  Job Posting
              ========================================== */}

              {application.jobUrl && (
                <section className="mt-8 fade-up">

                  <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <ExternalLink
                          size={18}
                          className="text-gray-700"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          Job Posting
                        </p>

                        <p className="text-sm text-gray-500 mt-0.5">
                          View the original job description
                        </p>
                      </div>

                    </div>

                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive-button inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800"
                    >
                      Open Job Posting
                      <ExternalLink size={15} />
                    </a>

                  </div>

                </section>
              )}

              {/* ==========================================
                  Notes
              ========================================== */}

              <section className="mt-8 fade-up">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                    <FileText
                      size={17}
                      className="text-slate-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-950">
                      Application Notes
                    </h2>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Your personal notes for this application.
                    </p>
                  </div>

                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 sm:p-6">

                  <p className="text-gray-700 whitespace-pre-wrap leading-7 text-sm sm:text-base">
                    {application.notes ||
                      "No notes added for this application."}
                  </p>

                </div>

              </section>

              {/* ==========================================
                  Interview Highlight
              ========================================== */}

              {application.interviewDate && (
                <section className="mt-8 fade-up">

                  <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 sm:p-6">

                    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-amber-200/20 blur-2xl" />

                    <div className="relative">

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        <div>

                          <div className="flex items-center gap-2.5">

                            <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center shadow-sm">
                              <Calendar
                                size={18}
                                className="text-amber-600"
                              />
                            </div>

                            <div>

                              <div className="flex items-center gap-2">

                                <h2 className="font-bold text-gray-950">
                                  Interview Scheduled
                                </h2>

                                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-soft" />

                              </div>

                              <p className="text-xs text-gray-500 mt-0.5">
                                Your upcoming interview
                              </p>

                            </div>

                          </div>

                          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">

                            <div>
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Date & Time
                              </p>

                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {formatInterviewDate(
                                  application.interviewDate
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Type
                              </p>

                              <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1.5">
                                {application.interviewType ===
                                "Online" ? (
                                  <Video size={14} />
                                ) : (
                                  <MapPin size={14} />
                                )}

                                {application.interviewType ||
                                  "Online"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Duration
                              </p>

                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {application.interviewDuration ||
                                  60}{" "}
                                minutes
                              </p>
                            </div>

                          </div>

                          {application.interviewLocation && (
                            <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">

                              <MapPin
                                size={15}
                                className="mt-0.5 flex-shrink-0"
                              />

                              <span className="break-all">
                                {application.interviewLocation}
                              </span>

                            </div>
                          )}

                        </div>

                        <button
                          onClick={handleAddToCalendar}
                          disabled={addingToCalendar}
                          className="interactive-button inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {addingToCalendar ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                              Opening...
                            </>
                          ) : (
                            <>
                              <Calendar size={16} />
                              Add to Google Calendar
                            </>
                          )}
                        </button>
{calendarMessage && (
  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
    <CheckCircle2 size={16} />
    {calendarMessage}
  </div>
)}

{calendarError && (
  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-red-600">
    <AlertCircle size={16} />
    {calendarError}
  </div>
)}
                      </div>

                    </div>

                  </div>

                </section>
              )}

              {/* ==========================================
                  Recruiter & Interview
              ========================================== */}

              <section className="mt-10 border-t border-gray-100 pt-9 fade-up">

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <User
                          size={18}
                          className="text-indigo-600"
                        />
                      </div>

                      <div>

                        <h2 className="text-lg font-bold text-gray-950">
                          Recruiter & Interview
                        </h2>

                        <p className="text-sm text-gray-500 mt-0.5">
                          Keep important recruiter details and interview notes organized.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Recruiter Fields */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Name */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recruiter Name
                    </label>

                    <div className="relative">

                      <User
                        size={17}
                        className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                      />

                      <input
                        type="text"
                        value={recruiterName}
                        onChange={(e) =>
                          setRecruiterName(
                            e.target.value
                          )
                        }
                        placeholder="e.g. Rahul Sharma"
                        className="input-modern w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-10 pr-3 py-3 text-sm text-gray-900 outline-none"
                      />

                    </div>

                  </div>

                  {/* Email */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recruiter Email
                    </label>

                    <div className="relative">

                      <Mail
                        size={17}
                        className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                      />

                      <input
                        type="email"
                        value={recruiterEmail}
                        onChange={(e) =>
                          setRecruiterEmail(
                            e.target.value
                          )
                        }
                        placeholder="recruiter@example.com"
                        className="input-modern w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-10 pr-3 py-3 text-sm text-gray-900 outline-none"
                      />

                    </div>

                  </div>

                  {/* Phone */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recruiter Phone
                    </label>

                    <div className="relative">

                      <Phone
                        size={17}
                        className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                      />

                      <input
                        type="tel"
                        value={recruiterPhone}
                        onChange={(e) =>
                          setRecruiterPhone(
                            e.target.value
                          )
                        }
                        placeholder="Phone number"
                        className="input-modern w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-10 pr-3 py-3 text-sm text-gray-900 outline-none"
                      />

                    </div>

                  </div>

                  {/* LinkedIn */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recruiter LinkedIn
                    </label>

                    <div className="relative">

                      <ExternalLink
                        size={17}
                        className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                      />

                      <input
                        type="url"
                        value={recruiterLinkedin}
                        onChange={(e) =>
                          setRecruiterLinkedin(
                            e.target.value
                          )
                        }
                        placeholder="LinkedIn profile URL"
                        className="input-modern w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-10 pr-3 py-3 text-sm text-gray-900 outline-none"
                      />

                    </div>

                  </div>

                </div>

                {/* Recruiter Quick Actions */}

                {(recruiterEmail ||
                  recruiterPhone ||
                  recruiterLinkedin) && (
                  <div className="mt-5 flex flex-wrap gap-2">

                    {recruiterEmail && (
                      <a
                        href={`mailto:${recruiterEmail}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                      >
                        <Mail size={14} />
                        Email recruiter
                      </a>
                    )}

                    {recruiterPhone && (
                      <a
                        href={`tel:${recruiterPhone}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                      >
                        <Phone size={14} />
                        Call recruiter
                      </a>
                    )}

                    {recruiterLinkedin && (
                      <a
                        href={recruiterLinkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                      >
                        <ExternalLink size={14} />
                        LinkedIn
                      </a>
                    )}

                  </div>
                )}

                {/* Interview Notes */}

                <div className="mt-6">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interview Notes
                  </label>

                  <textarea
                    value={interviewNotes}
                    onChange={(e) =>
                      setInterviewNotes(
                        e.target.value
                      )
                    }
                    rows={5}
                    placeholder="Write important points from the interview..."
                    className="input-modern w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm text-gray-900 outline-none resize-y"
                  />

                </div>

                {/* Save */}

                <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">

                  <button
                    onClick={handleSaveInterviewInfo}
                    disabled={savingInterviewInfo}
                    className="interactive-button inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {savingInterviewInfo ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Information
                      </>
                    )}

                  </button>

                  {saveMessage && (
                    <div className="scale-in flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <CheckCircle2 size={16} />
                      {saveMessage}
                    </div>
                  )}

                  {saveError && (
                    <div className="scale-in flex items-center gap-2 text-sm font-medium text-red-600">
                      <AlertCircle size={16} />
                      {saveError}
                    </div>
                  )}

                </div>

              </section>

              {/* ==========================================
                  Timeline
              ========================================== */}

              <section className="mt-10 border-t border-gray-100 pt-9 fade-up">

                <div className="flex items-center gap-3 mb-7">

                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Clock
                      size={18}
                      className="text-slate-600"
                    />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-gray-950">
                      Application Timeline
                    </h2>

                    <p className="text-sm text-gray-500 mt-0.5">
                      A history of important activity.
                    </p>

                  </div>

                </div>

                {/* Loading */}

                {loadingTimeline && (
                  <div className="space-y-5">

                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex gap-4"
                      >

                        <div className="skeleton w-8 h-8 rounded-full bg-gray-100" />

                        <div className="flex-1">
                          <div className="skeleton h-4 w-3/4 rounded mb-2" />
                          <div className="skeleton h-3 w-32 rounded" />
                        </div>

                      </div>
                    ))}

                  </div>
                )}

                {/* Error */}

                {!loadingTimeline &&
                  timelineError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 flex items-start gap-3">

                      <AlertCircle
                        size={18}
                        className="text-red-500 mt-0.5 flex-shrink-0"
                      />

                      <div>
                        <p className="font-medium text-red-700 text-sm">
                          Timeline unavailable
                        </p>

                        <p className="text-sm text-red-600 mt-1">
                          {timelineError}
                        </p>
                      </div>

                    </div>
                  )}

                {/* Empty */}

                {!loadingTimeline &&
                  !timelineError &&
                  timeline.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">

                      <div className="mx-auto w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-3">
                        <Clock
                          size={18}
                          className="text-gray-400"
                        />
                      </div>

                      <p className="font-medium text-gray-700 text-sm">
                        No activity yet
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Updates will appear here as you manage this application.
                      </p>

                    </div>
                  )}

                {/* Timeline */}

                {!loadingTimeline &&
                  !timelineError &&
                  timeline.length > 0 && (
                    <div className="relative">

                      {/* Vertical line */}

                      <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-gray-300 via-gray-200 to-transparent" />

                      <div className="space-y-6">

                        {timeline.map(
                          (activity, index) => (
                            <div
                              key={activity._id}
                              className="timeline-item relative flex gap-4"
                              style={{
                                animationDelay: `${
                                  index * 80
                                }ms`,
                              }}
                            >

                              {/* Dot */}

                              <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">

                                <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />

                              </div>

                              {/* Content */}

                              <div className="flex-1 pb-1">

                                <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 hover:bg-gray-50 transition">

                                  <div className="flex items-start justify-between gap-3">

                                    <p className="text-sm font-semibold text-gray-900 leading-6">
                                      {activity.message}
                                    </p>

                                    <ChevronRight
                                      size={15}
                                      className="text-gray-300 mt-1 flex-shrink-0"
                                    />

                                  </div>

                                  <p className="mt-1.5 text-xs text-gray-400">
                                    {formatTimelineDate(
                                      activity.createdAt
                                    )}
                                  </p>

                                </div>

                              </div>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

              </section>

            </div>

          </div>

          {/* Footer */}

          <div className="text-center py-7">

            <p className="text-xs text-gray-400">
              JobTrack · Keep your career organized.
            </p>

          </div>

        </div>

      </div>

      {/* ==========================================
          Delete Confirmation Modal
      ========================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Backdrop */}

          <div
            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
            onClick={() =>
              !deleting &&
              setShowDeleteModal(false)
            }
          />

          {/* Modal */}

          <div className="relative w-full max-w-md rounded-3xl bg-white border border-gray-200 shadow-2xl scale-in overflow-hidden">

            <div className="p-6 sm:p-7">

              <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <Trash2
                    size={21}
                    className="text-red-600"
                  />
                </div>

                <button
                  onClick={() =>
                    !deleting &&
                    setShowDeleteModal(false)
                  }
                  disabled={deleting}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition disabled:opacity-50"
                >
                  <X size={18} />
                </button>

              </div>

              <h3 className="text-xl font-bold text-gray-950 mt-5">
                Delete application?
              </h3>

              <p className="text-sm text-gray-500 leading-6 mt-2">
                This will permanently remove your
                application for{" "}
                <span className="font-semibold text-gray-700">
                  {application.position}
                </span>{" "}
                at{" "}
                <span className="font-semibold text-gray-700">
                  {application.company}
                </span>
                .
              </p>

              <div className="mt-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">

                <p className="text-xs text-red-600">
                  This action cannot be undone.
                </p>

              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">

                <button
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={deleting}
                  className="interactive-button px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="interactive-button inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {deleting ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete Application
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default ApplicationDetails;