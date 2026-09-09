
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

  // Application Timeline
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
        const response = await API.get(`/applications/${id}`);

        const data = response.data;

        setApplication(data);

        setRecruiterName(data.recruiterName || "");
        setRecruiterEmail(data.recruiterEmail || "");
        setRecruiterPhone(data.recruiterPhone || "");
        setRecruiterLinkedin(data.recruiterLinkedin || "");
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/applications/${id}`);

      navigate("/applications");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete application"
      );
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
        "Recruiter and interview information saved successfully."
      );

      // Refresh timeline after saving
      await fetchTimeline();
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

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // Format Timeline Date
  // ==========================================

  const formatTimelineDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">
          Loading application details...
        </p>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() => navigate("/applications")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={18} />
            Back to Applications
          </button>

          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-red-600">
              {error || "Application not found"}
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // Main UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 page-enter">

      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/applications")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5"
        >
          <ArrowLeft size={18} />
          Back to Applications
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* ==========================================
              Header
          ========================================== */}

          <div className="p-6 sm:p-8 border-b border-gray-200">

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

              <div>

                <div className="flex items-center gap-3 mb-3">

                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">

                    <Briefcase
                      size={24}
                      className="text-gray-700"
                    />

                  </div>

                  <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                      {application.position}
                    </h1>

                    <p className="text-gray-500 mt-1">
                      {application.company}
                    </p>

                  </div>

                </div>

                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusStyle(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>

              </div>

              {/* Actions */}
              <div className="flex gap-2">

                <button
                  onClick={() =>
                    navigate(
                      `/applications/edit/${application._id}`
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

              </div>

            </div>

          </div>

          {/* ==========================================
              Details
          ========================================== */}

          <div className="p-6 sm:p-8">

            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Application Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Location */}
              <div className="border border-gray-200 rounded-xl p-4">

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                  <MapPin size={16} />

                  Location

                </div>

                <p className="font-medium text-gray-900">
                  {application.location || "Not specified"}
                </p>

              </div>

              {/* Job Type */}
              <div className="border border-gray-200 rounded-xl p-4">

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                  <Briefcase size={16} />

                  Job Type

                </div>

                <p className="font-medium text-gray-900">
                  {application.jobType || "Not specified"}
                </p>

              </div>

              {/* Applied Date */}
              <div className="border border-gray-200 rounded-xl p-4">

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                  <Calendar size={16} />

                  Applied Date

                </div>

                <p className="font-medium text-gray-900">
                  {formatDate(application.appliedDate)}
                </p>

              </div>

              {/* Follow-up Date */}
              <div className="border border-gray-200 rounded-xl p-4">

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                  <Calendar size={16} />

                  Follow-up Date

                </div>

                <p className="font-medium text-gray-900">

                  {application.followUpDate
                    ? formatDate(application.followUpDate)
                    : "Not scheduled"}

                </p>

              </div>

              {/* Created */}
              <div className="border border-gray-200 rounded-xl p-4">

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                  <Calendar size={16} />

                  Added On

                </div>

                <p className="font-medium text-gray-900">
                  {formatDate(application.createdAt)}
                </p>

              </div>

            </div>

            {/* ==========================================
                Job URL
            ========================================== */}

            {application.jobUrl && (

              <div className="mt-6 border border-gray-200 rounded-xl p-4">

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                  <ExternalLink size={16} />

                  Job Posting

                </div>

                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium break-all"
                >
                  Open Job Posting
                  <ExternalLink size={15} />
                </a>

              </div>

            )}

            {/* ==========================================
                Notes
            ========================================== */}

            <div className="mt-6">

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">

                <FileText size={16} />

                Notes

              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">

                <p className="text-gray-700 whitespace-pre-wrap leading-7">

                  {application.notes ||
                    "No notes added for this application."}

                </p>

              </div>

            </div>

            {/* ==========================================
                Recruiter & Interview Information
            ========================================== */}

            <div className="mt-8 border-t border-gray-200 pt-8">

              <div className="mb-5">

                <h2 className="text-lg font-semibold text-gray-900">
                  Recruiter & Interview Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add recruiter details and notes from your
                  interview process.
                </p>

              </div>

              {/* Recruiter Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Recruiter Name */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recruiter Name
                  </label>

                  <div className="relative">

                    <User
                      size={17}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      type="text"
                      value={recruiterName}
                      onChange={(e) =>
                        setRecruiterName(e.target.value)
                      }
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                    />

                  </div>

                </div>

                {/* Recruiter Email */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recruiter Email
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      type="email"
                      value={recruiterEmail}
                      onChange={(e) =>
                        setRecruiterEmail(e.target.value)
                      }
                      placeholder="recruiter@example.com"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                    />

                  </div>

                </div>

                {/* Recruiter Phone */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recruiter Phone
                  </label>

                  <div className="relative">

                    <Phone
                      size={17}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      type="tel"
                      value={recruiterPhone}
                      onChange={(e) =>
                        setRecruiterPhone(e.target.value)
                      }
                      placeholder="Phone number"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                    />

                  </div>

                </div>

                {/* Recruiter LinkedIn */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recruiter LinkedIn
                  </label>

                  <div className="relative">

                    <ExternalLink
                      size={17}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      type="url"
                      value={recruiterLinkedin}
                      onChange={(e) =>
                        setRecruiterLinkedin(e.target.value)
                      }
                      placeholder="LinkedIn profile URL"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                    />

                  </div>

                </div>

              </div>

              {/* Interview Notes */}
              <div className="mt-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Notes
                </label>

                <textarea
                  value={interviewNotes}
                  onChange={(e) =>
                    setInterviewNotes(e.target.value)
                  }
                  rows={5}
                  placeholder="Write important points from the interview..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none resize-y focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                />

              </div>

              {/* Save */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">

                <button
                  onClick={handleSaveInterviewInfo}
                  disabled={savingInterviewInfo}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <Save size={16} />

                  {savingInterviewInfo
                    ? "Saving..."
                    : "Save Information"}

                </button>

                {saveMessage && (

                  <p className="text-sm text-green-600">
                    {saveMessage}
                  </p>

                )}

                {saveError && (

                  <p className="text-sm text-red-600">
                    {saveError}
                  </p>

                )}

              </div>

            </div>

            {/* ==========================================
                Application Timeline
            ========================================== */}

            <div className="mt-8 border-t border-gray-200 pt-8">

              <div className="mb-5">

                <h2 className="text-lg font-semibold text-gray-900">
                  Application Timeline
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Track important updates and activity for this application.
                </p>

              </div>

              {/* Loading */}
              {loadingTimeline && (

                <div className="text-sm text-gray-500">
                  Loading timeline...
                </div>

              )}

              {/* Error */}
              {!loadingTimeline && timelineError && (

                <div className="rounded-lg border border-red-200 bg-red-50 p-4">

                  <p className="text-sm text-red-600">
                    {timelineError}
                  </p>

                </div>

              )}

              {/* Empty */}
              {!loadingTimeline &&
                !timelineError &&
                timeline.length === 0 && (

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

                    <p className="text-sm text-gray-500">
                      No activity recorded yet.
                    </p>

                  </div>

                )}

              {/* Timeline */}
              {!loadingTimeline &&
                !timelineError &&
                timeline.length > 0 && (

                  <div className="relative ml-1">

                    {/* Timeline Line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />

                    <div className="space-y-6">

                      {timeline.map((activity) => (

                        <div
                          key={activity._id}
                          className="relative pl-7"
                        >

                          {/* Timeline Dot */}
                          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-gray-900 bg-white" />

                          <div>

                            <p className="text-sm font-medium text-gray-900">
                              {activity.message}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {formatTimelineDate(
                                activity.createdAt
                              )}
                            </p>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>

                )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ApplicationDetails;

