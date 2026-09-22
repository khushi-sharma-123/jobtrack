import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Link2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Tag,
  UserRound,
  X,
} from "lucide-react";

import API from "../services/api";

function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    jobType: "Full-time",
    status: "Applied",
    appliedDate: "",
    followUpDate: "",
    jobUrl: "",
    notes: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

        const application = response.data;

        setFormData({
          company: application.company || "",
          position: application.position || "",
          location: application.location || "",
          jobType:
            application.jobType || "Full-time",
          status:
            application.status || "Applied",
          appliedDate: application.appliedDate
            ? application.appliedDate.split("T")[0]
            : "",
          followUpDate: application.followUpDate
            ? application.followUpDate.split("T")[0]
            : "",
          jobUrl: application.jobUrl || "",
          notes: application.notes || "",
          tags: application.tags || [],
        });
      } catch (error) {
        console.error(
          "Failed to load application:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load application"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // ==========================================
  // Handle Input Changes
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ==========================================
  // Add Tag
  // ==========================================
  const handleAddTag = () => {
    const newTag = tagInput.trim();

    if (!newTag) return;

    if (formData.tags.includes(newTag)) {
      setTagInput("");
      return;
    }

    if (formData.tags.length >= 10) {
      setError(
        "You can add a maximum of 10 tags."
      );
      return;
    }

    if (newTag.length > 30) {
      setError(
        "Each tag must be 30 characters or less."
      );
      return;
    }

    setFormData({
      ...formData,
      tags: [...formData.tags, newTag],
    });

    setTagInput("");
    setError("");
  };

  // ==========================================
  // Remove Tag
  // ==========================================
  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(
        (tag) => tag !== tagToRemove
      ),
    });
  };

  // ==========================================
  // Tag Enter Key
  // ==========================================
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // ==========================================
  // Submit
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await API.put(
        `/applications/${id}`,
        formData
      );

      navigate("/applications");
    } catch (error) {
      console.error(
        "Failed to update application:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update application"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Status Config
  // ==========================================
  const getStatusConfig = (status) => {
    switch (status) {
      case "Applied":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-100",
          dot: "bg-blue-500",
          progress: "w-1/4 bg-blue-500",
        };

      case "Interview":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-100",
          dot: "bg-amber-500",
          progress: "w-2/4 bg-amber-500",
        };

      case "Offer":
        return {
          bg: "bg-violet-50",
          text: "text-violet-700",
          border: "border-violet-100",
          dot: "bg-violet-500",
          progress: "w-3/4 bg-violet-500",
        };

      case "Selected":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-100",
          dot: "bg-emerald-500",
          progress: "w-full bg-emerald-500",
        };

      case "Rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-100",
          dot: "bg-red-500",
          progress: "w-0 bg-red-500",
        };

      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-100",
          dot: "bg-gray-400",
          progress: "w-0 bg-gray-400",
        };
    }
  };

  const statusConfig = getStatusConfig(
    formData.status
  );

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">

          <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />

          <div className="mt-6 h-10 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">

            <div className="h-[700px] animate-pulse rounded-2xl bg-gray-200" />

            <div className="h-[400px] animate-pulse rounded-2xl bg-gray-200" />

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900">

      {/* ==========================================
          Navbar
      ========================================== */}
      <nav className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

          <Link
            to="/dashboard"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
              J
            </div>

            <div>
              <p className="text-[17px] font-bold tracking-tight text-gray-900">
                JobTrack
              </p>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400 sm:block">
                Career workspace
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() =>
              navigate("/applications")
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">
              Applications
            </span>
          </button>
        </div>
      </nav>

      {/* ==========================================
          Main
      ========================================== */}
      <main className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6 lg:px-8">

        {/* ========================================
            Breadcrumb
        ======================================== */}
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="transition hover:text-indigo-600"
          >
            Dashboard
          </button>

          <ChevronRightIcon />

          <button
            type="button"
            onClick={() =>
              navigate("/applications")
            }
            className="transition hover:text-indigo-600"
          >
            Applications
          </button>

          <ChevronRightIcon />

          <span className="text-gray-500">
            Edit Application
          </span>
        </div>

        {/* ========================================
            Header
        ======================================== */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-[34px]">
              Edit Application
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500">
              Update the details of your job application
              and keep your tracker accurate.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-2.5 text-xs font-medium text-indigo-700 sm:flex">
            <Pencil size={14} />
            Editing application
          </div>
        </div>

        {/* ========================================
            Error
        ======================================== */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">

            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
              <X size={12} />
            </div>

            <p>{error}</p>
          </div>
        )}

        {/* ========================================
            Form
        ======================================== */}
        <form onSubmit={handleSubmit}>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">

            {/* ======================================
                LEFT
            ====================================== */}
            <div className="space-y-5">

              {/* Application Details */}
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-5 py-4 sm:px-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                      <Briefcase
                        size={17}
                        className="text-indigo-600"
                      />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        Application Details
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-400">
                        Update the basic information
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-5 sm:p-6">

                  <div className="grid gap-5 md:grid-cols-2">

                    {/* Company */}
                    <InputField
                      icon={Briefcase}
                      label="Company"
                      value={formData.company}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          company: value,
                        })
                      }
                      placeholder="e.g. Google"
                      required
                    />

                    {/* Position */}
                    <InputField
                      icon={UserRound}
                      label="Position"
                      value={formData.position}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          position: value,
                        })
                      }
                      placeholder="Software Engineer Intern"
                      required
                    />

                    {/* Location */}
                    <InputField
                      icon={MapPin}
                      label="Location"
                      value={formData.location}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          location: value,
                        })
                      }
                      placeholder="Jaipur / Remote"
                    />

                    {/* Job Type */}
                    <SelectField
                      label="Job Type"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      options={[
                        "Full-time",
                        "Part-time",
                        "Internship",
                        "Contract",
                      ]}
                    />

                    {/* Status */}
                    <SelectField
                      label="Current Status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      options={[
                        "Applied",
                        "Interview",
                        "Offer",
                        "Rejected",
                        "Selected",
                      ]}
                    />

                    {/* Applied Date */}
                    <DateField
                      label="Applied Date"
                      icon={CalendarDays}
                      value={formData.appliedDate}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          appliedDate: value,
                        })
                      }
                    />

                    {/* Follow Up */}
                    <DateField
                      label="Follow-up Date"
                      icon={Clock3}
                      value={formData.followUpDate}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          followUpDate: value,
                        })
                      }
                    />

                    {/* URL */}
                    <div className="md:col-span-2">
                      <InputField
                        icon={Link2}
                        label="Job URL"
                        value={formData.jobUrl}
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            jobUrl: value,
                          })
                        }
                        placeholder="https://company.com/jobs/..."
                        type="url"
                      />
                    </div>

                  </div>
                </div>
              </section>

              {/* ====================================
                  Organization
              ==================================== */}
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-5 py-4 sm:px-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                      <Tag
                        size={17}
                        className="text-gray-600"
                      />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        Organization
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-400">
                        Manage tags and application notes
                      </p>
                    </div>

                  </div>

                </div>

                <div className="space-y-6 p-5 sm:p-6">

                  {/* Tags */}
                  <div>

                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                      Tags
                    </label>

                    <div className="flex gap-2">

                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) =>
                          setTagInput(
                            e.target.value
                          )
                        }
                        onKeyDown={
                          handleTagKeyDown
                        }
                        placeholder="Java, React, Remote..."
                        className="h-11 min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50/70 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      />

                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                      >
                        <Plus size={15} />
                        Add
                      </button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">

                        {formData.tags.map(
                          (tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                            >
                              <Tag size={11} />

                              {tag}

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveTag(
                                    tag
                                  )
                                }
                                className="rounded-full p-0.5 text-indigo-400 transition hover:bg-indigo-100 hover:text-red-500"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )
                        )}
                      </div>
                    )}

                    <p className="mt-2 text-[11px] text-gray-400">
                      Up to 10 tags. Press Enter or click
                      Add.
                    </p>
                  </div>

                  {/* Notes */}
                  <div>

                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                      Notes
                    </label>

                    <div className="relative">

                      <FileText
                        size={15}
                        className="absolute left-3.5 top-3.5 text-gray-400"
                      />

                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Add recruiter details, preparation notes, salary information..."
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      />

                    </div>

                  </div>
                </div>
              </section>

              {/* ====================================
                  Bottom Actions
              ==================================== */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/applications")
                  }
                  className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </div>

            {/* ======================================
                RIGHT SIDEBAR
            ====================================== */}
            <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">

              {/* Preview */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-5 py-4">

                  <h3 className="text-sm font-semibold text-gray-900">
                    Application Preview
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Changes update instantly
                  </p>

                </div>

                <div className="p-5">

                  <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-600">
                        {formData.company
                          ? formData.company
                              .trim()
                              .charAt(0)
                              .toUpperCase()
                          : "J"}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          {formData.position ||
                            "Your position"}
                        </p>

                        <p className="mt-0.5 truncate text-xs font-medium text-indigo-600">
                          {formData.company ||
                            "Company name"}
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 space-y-2.5">

                      <div className="flex items-center justify-between gap-3">

                        <span className="text-xs text-gray-400">
                          Status
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                          />

                          {formData.status}
                        </span>

                      </div>

                      <div className="flex items-center justify-between gap-3">

                        <span className="text-xs text-gray-400">
                          Job type
                        </span>

                        <span className="text-xs font-medium text-gray-700">
                          {formData.jobType}
                        </span>

                      </div>

                      {formData.location && (
                        <div className="flex items-center justify-between gap-3">

                          <span className="text-xs text-gray-400">
                            Location
                          </span>

                          <span className="max-w-[160px] truncate text-xs font-medium text-gray-700">
                            {formData.location}
                          </span>

                        </div>
                      )}

                      {formData.appliedDate && (
                        <div className="flex items-center justify-between gap-3">

                          <span className="text-xs text-gray-400">
                            Applied
                          </span>

                          <span className="text-xs font-medium text-gray-700">
                            {formatDisplayDate(
                              formData.appliedDate
                            )}
                          </span>

                        </div>
                      )}

                      {formData.followUpDate && (
                        <div className="flex items-center justify-between gap-3">

                          <span className="text-xs text-gray-400">
                            Follow-up
                          </span>

                          <span className="text-xs font-medium text-gray-700">
                            {formatDisplayDate(
                              formData.followUpDate
                            )}
                          </span>

                        </div>
                      )}

                    </div>
                  </div>

                  {/* URL */}
                  {formData.jobUrl && (
                    <a
                      href={formData.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <span className="flex min-w-0 items-center gap-2">

                        <ExternalLink size={14} />

                        <span className="truncate">
                          Open job posting
                        </span>

                      </span>

                      <ArrowRight size={14} />
                    </a>
                  )}

                </div>
              </div>

              {/* Status Progress */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-2">

                  <Clock3
                    size={15}
                    className="text-gray-400"
                  />

                  <p className="text-xs font-semibold text-gray-700">
                    Application progress
                  </p>

                </div>

                <div className="mt-4 flex items-center gap-2">

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className={`h-full rounded-full transition-all duration-300 ${statusConfig.progress}`}
                    />

                  </div>

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Current stage:{" "}
                  <span className="font-semibold text-gray-700">
                    {formData.status}
                  </span>
                </p>

              </div>

              {/* Helpful Tip */}
              <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50">

                <div className="p-5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Sparkles
                      size={17}
                      className="text-indigo-600"
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-gray-900">
                    Keep your tracker accurate
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-gray-600">
                    Update the status and follow-up date as
                    your application moves through the hiring
                    process.
                  </p>

                  <div className="mt-4 flex items-start gap-2">

                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-indigo-600"
                    />

                    <p className="text-xs leading-5 text-gray-600">
                      Keep notes and tags updated so you can
                      quickly find important information later.
                    </p>

                  </div>

                </div>
              </div>

              {/* Desktop Save */}
              <div className="hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm xl:block">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Save Changes
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/applications")
                  }
                  className="mt-2 h-10 w-full rounded-xl text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                >
                  Cancel
                </button>

              </div>

            </aside>
          </div>
        </form>

        {/* Footer */}
        <div className="py-7 text-center">
          <p className="text-xs text-gray-400">
            JobTrack · Keep your career organized.
          </p>
        </div>
      </main>
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
  required = false,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <div className="relative">

        <Icon
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          required={required}
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
        />

      </div>
    </div>
  );
}

/* ==========================================
   Select
========================================== */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
      >
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ==========================================
   Date
========================================== */

function DateField({
  label,
  icon: Icon,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <div className="relative">

        <Icon
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="date"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
        />

      </div>

      {label === "Follow-up Date" && (
        <p className="mt-1.5 text-[11px] text-gray-400">
          Set a date to remind yourself to follow up.
        </p>
      )}
    </div>
  );
}

/* ==========================================
   Breadcrumb Chevron
========================================== */

function ChevronRightIcon() {
  return (
    <ArrowRight
      size={12}
      className="text-gray-300"
    />
  );
}

/* ==========================================
   Display Date
========================================== */

function formatDisplayDate(value) {
  if (!value) return "";

  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default EditApplication;