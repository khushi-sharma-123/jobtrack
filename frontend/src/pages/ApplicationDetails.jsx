import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
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
  Link2,
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
  const [addingToCalendar, setAddingToCalendar] =
    useState(false);
  const [calendarMessage, setCalendarMessage] = useState("");
  const [calendarError, setCalendarError] = useState("");

  // Delete
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  const [deleting, setDeleting] = useState(false);

  // Timeline
  const [timeline, setTimeline] = useState([]);
  const [loadingTimeline, setLoadingTimeline] =
    useState(true);
  const [timelineError, setTimelineError] = useState("");

  // ==========================================
  // Fetch Timeline
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
  // Delete
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

      setError(
        error.response?.data?.message ||
          "Failed to delete application"
      );

      setDeleting(false);
    }
  };

  // ==========================================
  // Save Recruiter / Interview Information
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
  // Add To Calendar
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

      const calendarUrl =
        response.data.calendarUrl;

      if (!calendarUrl) {
        throw new Error(
          "Calendar link was not generated."
        );
      }

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
          bg: "bg-violet-50",
          text: "text-violet-700",
          border: "border-violet-200",
          dot: "bg-violet-500",
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
  // Dates
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
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="h-1.5 bg-gray-200" />

            <div className="p-6 sm:p-8">
              <div className="flex gap-4">
                <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-200" />

                <div className="space-y-3">
                  <div className="h-7 w-56 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-2xl bg-gray-100"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================
  if (error || !application) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <button
            type="button"
            onClick={() => navigate("/applications")}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft
              size={17}
              className="transition group-hover:-translate-x-1"
            />
            Back to Applications
          </button>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <AlertCircle
                size={25}
                className="text-red-500"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              Unable to load application
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {error || "Application not found"}
            </p>

            <button
              type="button"
              onClick={() => navigate("/applications")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
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
    <div className="min-h-screen bg-[#f7f8fc]">
      <main className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6 lg:px-8">

        {/* ==========================================
            Breadcrumb / Back
        ========================================== */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-400">

          <button
            type="button"
            onClick={() => navigate("/applications")}
            className="group inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft
              size={16}
              className="transition group-hover:-translate-x-1"
            />
            Applications
          </button>

          <ChevronRight size={13} />

          <span className="text-gray-500">
            Application Details
          </span>
        </div>

        {/* ==========================================
            Main Card
        ========================================== */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">

          {/* Accent */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-400" />

          {/* ========================================
              Hero
          ======================================== */}
          <section className="relative overflow-hidden border-b border-gray-100">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

            <div className="pointer-events-none absolute bottom-0 right-1/3 h-44 w-44 rounded-full bg-violet-100/30 blur-3xl" />

            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                {/* Company */}
                <div className="min-w-0">
                  <div className="flex items-start gap-4">

                    <div className="relative shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-950 to-gray-700 text-white shadow-lg shadow-gray-900/10 sm:h-16 sm:w-16">
                        <Building2 size={27} />
                      </div>

                      <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${statusConfig.dot}`}
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h1 className="break-words text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                        {application.position}
                      </h1>

                      <p className="mt-1 text-base font-medium text-indigo-600 sm:text-lg">
                        {application.company}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          <StatusIcon size={13} />
                          {application.status}
                        </span>

                        {application.jobType && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
                            <Briefcase size={13} />
                            {application.jobType}
                          </span>
                        )}

                        {application.location && (
                          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
                            <MapPin size={13} />
                            <span className="truncate">
                              {application.location}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/applications/edit/${application._id}`
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowDeleteModal(true)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================
              Content
          ======================================== */}
          <div className="p-5 sm:p-7 lg:p-8">

            {/* ======================================
                Overview
            ====================================== */}
            <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-gray-950">
                    Application Overview
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Key information about this opportunity.
                  </p>
                </div>

                <div className="hidden items-center gap-1.5 text-xs font-medium text-gray-400 sm:flex">
                  <Sparkles size={14} />
                  JobTrack
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

                {/* Location */}
                <InfoCard
                  icon={MapPin}
                  iconBg="bg-blue-50"
                  iconColor="text-blue-600"
                  label="Location"
                  value={
                    application.location ||
                    "Not specified"
                  }
                />

                {/* Job Type */}
                <InfoCard
                  icon={Briefcase}
                  iconBg="bg-violet-50"
                  iconColor="text-violet-600"
                  label="Job Type"
                  value={
                    application.jobType ||
                    "Not specified"
                  }
                />

                {/* Applied */}
                <InfoCard
                  icon={Calendar}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-600"
                  label="Applied On"
                  value={formatDate(
                    application.appliedDate
                  )}
                />

                {/* Follow Up */}
                <InfoCard
                  icon={Clock}
                  iconBg="bg-amber-50"
                  iconColor="text-amber-600"
                  label="Follow-up"
                  value={
                    application.followUpDate
                      ? formatDate(
                          application.followUpDate
                        )
                      : "Not scheduled"
                  }
                />

                {/* Added */}
                <InfoCard
                  icon={FileText}
                  iconBg="bg-gray-100"
                  iconColor="text-gray-600"
                  label="Added On"
                  value={formatDate(
                    application.createdAt
                  )}
                />

                {/* Status */}
                <InfoCard
                  icon={StatusIcon}
                  iconBg={statusConfig.bg}
                  iconColor={statusConfig.text}
                  label="Current Status"
                  value={application.status}
                />
              </div>
            </section>

            {/* ======================================
                Job Posting
            ====================================== */}
            {application.jobUrl && (
              <section className="mt-7">
                <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
                      <Link2
                        size={17}
                        className="text-gray-700"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Job Posting
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Open the original job description.
                      </p>
                    </div>
                  </div>

                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Open Job Posting
                    <ExternalLink size={15} />
                  </a>
                </div>
              </section>
            )}

            {/* ======================================
                Notes
            ====================================== */}
            <section className="mt-8">
              <SectionHeading
                icon={FileText}
                iconBg="bg-gray-100"
                iconColor="text-gray-600"
                title="Application Notes"
                subtitle="Your personal notes for this application."
              />

              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50/70 p-5 sm:p-6">
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700 sm:text-[15px]">
                  {application.notes ||
                    "No notes added for this application."}
                </p>
              </div>
            </section>

            {/* ======================================
                Interview
            ====================================== */}
            {application.interviewDate && (
              <section className="mt-8">
                <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 sm:p-6">

                  <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-200/30 blur-3xl" />

                  <div className="relative">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white shadow-sm">
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

                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            </div>

                            <p className="mt-0.5 text-xs text-gray-500">
                              Your upcoming interview
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-3">

                          <InterviewMeta
                            label="Date & Time"
                            value={formatInterviewDate(
                              application.interviewDate
                            )}
                          />

                          <InterviewMeta
                            label="Type"
                            value={
                              application.interviewType ||
                              "Online"
                            }
                            icon={
                              application.interviewType ===
                              "Online"
                                ? Video
                                : MapPin
                            }
                          />

                          <InterviewMeta
                            label="Duration"
                            value={`${application.interviewDuration || 60} minutes`}
                            icon={Clock}
                          />
                        </div>

                        {application.interviewLocation && (
                          <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                            {application.interviewType ===
                            "Online" ? (
                              <Video
                                size={15}
                                className="mt-0.5 shrink-0"
                              />
                            ) : (
                              <MapPin
                                size={15}
                                className="mt-0.5 shrink-0"
                              />
                            )}

                            <span className="break-all">
                              {application.interviewLocation}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={handleAddToCalendar}
                          disabled={addingToCalendar}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
                              Add to Calendar
                            </>
                          )}
                        </button>

                        {calendarMessage && (
                          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-emerald-600">
                            <CheckCircle2 size={14} />
                            {calendarMessage}
                          </div>
                        )}

                        {calendarError && (
                          <div className="mt-2 max-w-sm text-xs font-medium text-red-600">
                            {calendarError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ======================================
                Recruiter
            ====================================== */}
            <section className="mt-9 border-t border-gray-100 pt-8">
              <SectionHeading
                icon={User}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
                title="Recruiter & Interview"
                subtitle="Keep recruiter information and interview notes organized."
              />

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <InputField
                  icon={User}
                  label="Recruiter Name"
                  value={recruiterName}
                  onChange={setRecruiterName}
                  placeholder="e.g. Rahul Sharma"
                />

                <InputField
                  icon={Mail}
                  label="Recruiter Email"
                  value={recruiterEmail}
                  onChange={setRecruiterEmail}
                  placeholder="recruiter@example.com"
                  type="email"
                />

                <InputField
                  icon={Phone}
                  label="Recruiter Phone"
                  value={recruiterPhone}
                  onChange={setRecruiterPhone}
                  placeholder="Phone number"
                  type="tel"
                />

                <InputField
                  icon={ExternalLink}
                  label="Recruiter LinkedIn"
                  value={recruiterLinkedin}
                  onChange={setRecruiterLinkedin}
                  placeholder="LinkedIn profile URL"
                  type="url"
                />
              </div>

              {/* Quick actions */}
              {(recruiterEmail ||
                recruiterPhone ||
                recruiterLinkedin) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {recruiterEmail && (
                    <a
                      href={`mailto:${recruiterEmail}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      <Mail size={14} />
                      Email recruiter
                    </a>
                  )}

                  {recruiterPhone && (
                    <a
                      href={`tel:${recruiterPhone}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
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
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      <ExternalLink size={14} />
                      LinkedIn
                    </a>
                  )}
                </div>
              )}

              {/* Interview notes */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Interview Notes
                </label>

                <textarea
                  value={interviewNotes}
                  onChange={(e) =>
                    setInterviewNotes(e.target.value)
                  }
                  rows={5}
                  placeholder="Write important points from the interview..."
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* Save */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleSaveInterviewInfo}
                  disabled={savingInterviewInfo}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <CheckCircle2 size={16} />
                    {saveMessage}
                  </div>
                )}

                {saveError && (
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                    <AlertCircle size={16} />
                    {saveError}
                  </div>
                )}
              </div>
            </section>

            {/* ======================================
                Timeline
            ====================================== */}
            <section className="mt-9 border-t border-gray-100 pt-8">
              <SectionHeading
                icon={Clock}
                iconBg="bg-gray-100"
                iconColor="text-gray-600"
                title="Application Timeline"
                subtitle="A history of important activity."
              />

              <div className="mt-6">

                {loadingTimeline && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex gap-3"
                      >
                        <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200" />

                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                          <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loadingTimeline &&
                  timelineError && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-red-500"
                      />

                      <div>
                        <p className="text-sm font-semibold text-red-700">
                          Timeline unavailable
                        </p>

                        <p className="mt-1 text-xs text-red-600">
                          {timelineError}
                        </p>
                      </div>
                    </div>
                  )}

                {!loadingTimeline &&
                  !timelineError &&
                  timeline.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white">
                        <Clock
                          size={18}
                          className="text-gray-400"
                        />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-gray-700">
                        No activity yet
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Updates will appear here as you manage
                        this application.
                      </p>
                    </div>
                  )}

                {!loadingTimeline &&
                  !timelineError &&
                  timeline.length > 0 && (
                    <div className="relative">

                      {/* Line */}
                      <div className="absolute bottom-4 left-[18px] top-4 w-px bg-gray-200" />

                      <div className="space-y-5">
                        {timeline.map((activity, index) => (
                          <div
                            key={activity._id}
                            className="relative flex gap-4"
                          >
                            {/* Dot */}
                            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                              <div
                                className={`h-2.5 w-2.5 rounded-full ${
                                  index === 0
                                    ? "bg-indigo-500"
                                    : "bg-gray-400"
                                }`}
                              />
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 transition hover:bg-gray-50">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-medium leading-6 text-gray-900">
                                  {activity.message}
                                </p>

                                <ChevronRight
                                  size={14}
                                  className="mt-1 shrink-0 text-gray-300"
                                />
                              </div>

                              <p className="mt-1.5 text-[11px] text-gray-400">
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
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="py-7 text-center">
          <p className="text-xs text-gray-400">
            JobTrack · Keep your career organized.
          </p>
        </div>
      </main>

      {/* ==========================================
          Delete Modal
      ========================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
            onClick={() =>
              !deleting &&
              setShowDeleteModal(false)
            }
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="p-6 sm:p-7">

              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                  <Trash2
                    size={20}
                    className="text-red-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    !deleting &&
                    setShowDeleteModal(false)
                  }
                  disabled={deleting}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-950">
                Delete application?
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                This will permanently remove your application
                for{" "}
                <span className="font-semibold text-gray-700">
                  {application.position}
                </span>{" "}
                at{" "}
                <span className="font-semibold text-gray-700">
                  {application.company}
                </span>
                .
              </p>

              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-xs font-medium text-red-600">
                  This action cannot be undone.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={deleting}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
}

/* ==========================================
   Reusable Info Card
========================================== */

function InfoCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm sm:p-5">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon
          size={17}
          className={iconColor}
        />
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

/* ==========================================
   Section Heading
========================================== */

function SectionHeading({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon
          size={18}
          className={iconColor}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold tracking-tight text-gray-950">
          {title}
        </h2>

        <p className="mt-0.5 text-sm text-gray-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ==========================================
   Interview Meta
========================================== */

function InterviewMeta({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400">
        {label}
      </p>

      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
        {Icon && <Icon size={14} />}
        {value}
      </p>
    </div>
  );
}

/* ==========================================
   Input Field
========================================== */

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
        />
      </div>
    </div>
  );
}

export default ApplicationDetails;