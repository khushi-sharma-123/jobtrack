import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Mail,
  MapPin,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  UserRound,
  Video,
  X,
} from "lucide-react";

import API from "../services/api";

function AddApplication() {
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

    // Interview details
    interviewDate: "",
    interviewDuration: 60,
    interviewType: "Online",
    interviewLocation: "",
    interviewNotes: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Handle Input
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Add Tag
  // ==========================================
  const handleAddTag = () => {
    const newTag = tagInput.trim();

    if (!newTag) {
      return;
    }

    if (formData.tags.includes(newTag)) {
      setTagInput("");
      return;
    }

    if (formData.tags.length >= 10) {
      setError("You can add a maximum of 10 tags.");
      return;
    }

    if (newTag.length > 30) {
      setError("Each tag must be 30 characters or less.");
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
    setLoading(true);

    try {
      const payload = {
        ...formData,
        interviewDuration: Number(
          formData.interviewDuration
        ),
      };

      await API.post("/applications", payload);

      navigate("/applications");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add application"
      );
    } finally {
      setLoading(false);
    }
  };

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
            onClick={() => navigate("/applications")}
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
        {/* ==========================================
            Header
        ========================================== */}
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="transition hover:text-indigo-600"
            >
              Dashboard
            </button>

            <ArrowRight size={12} />

            <button
              type="button"
              onClick={() => navigate("/applications")}
              className="transition hover:text-indigo-600"
            >
              Applications
            </button>

            <ArrowRight size={12} />

            <span className="text-gray-500">
              Add Application
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-[34px]">
                Add Application
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500">
                Capture the important details of a new job or
                internship application.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-2.5 text-xs font-medium text-indigo-700 sm:flex">
              <Sparkles size={15} />
              Keep your job search organized
            </div>
          </div>
        </div>

        {/* ==========================================
            Error
        ========================================== */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
              <X size={12} />
            </div>

            <p>{error}</p>
          </div>
        )}

        {/* ==========================================
            Main Layout
        ========================================== */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* ========================================
                LEFT - Main Form
            ======================================== */}
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
                        Basic information about the opportunity
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Company */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Company
                      </label>

                      <div className="relative">
                        <Briefcase
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="e.g. Google"
                          required
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />
                      </div>
                    </div>

                    {/* Position */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Position
                      </label>

                      <div className="relative">
                        <UserRound
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          placeholder="Software Engineer Intern"
                          required
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Location
                      </label>

                      <div className="relative">
                        <MapPin
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Jaipur / Remote"
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />
                      </div>
                    </div>

                    {/* Job Type */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Job Type
                      </label>

                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Current Status
                      </label>

                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      >
                        <option>Applied</option>
                        <option>Interview</option>
                        <option>Offer</option>
                        <option>Rejected</option>
                        <option>Selected</option>
                      </select>
                    </div>

                    {/* Applied Date */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Applied Date
                      </label>

                      <div className="relative">
                        <CalendarDays
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="date"
                          name="appliedDate"
                          value={formData.appliedDate}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />
                      </div>
                    </div>

                    {/* Follow Up */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Follow-up Date
                      </label>

                      <div className="relative">
                        <Clock3
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="date"
                          name="followUpDate"
                          value={formData.followUpDate}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />
                      </div>

                      <p className="mt-1.5 text-[11px] text-gray-400">
                        Set a reminder to follow up later.
                      </p>
                    </div>

                    {/* Job URL */}
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Job URL
                      </label>

                      <div className="relative">
                        <Link2
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="url"
                          name="jobUrl"
                          value={formData.jobUrl}
                          onChange={handleChange}
                          placeholder="https://company.com/jobs/..."
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================
                  Interview Details
              ======================================== */}
              {formData.status === "Interview" && (
                <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
                  <div className="border-b border-violet-100 bg-violet-50/50 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                        <CalendarDays
                          size={17}
                          className="text-violet-600"
                        />
                      </div>

                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                          Interview Details
                        </h2>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Add the interview information for this
                          application
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                      {/* Interview Date */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Interview Date & Time
                        </label>

                        <input
                          type="datetime-local"
                          name="interviewDate"
                          value={formData.interviewDate}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 text-sm text-gray-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
                        />

                        <p className="mt-1.5 text-[11px] text-gray-400">
                          Optional — schedule it later if needed.
                        </p>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Duration
                        </label>

                        <select
                          name="interviewDuration"
                          value={formData.interviewDuration}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 text-sm text-gray-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
                        >
                          <option value={15}>
                            15 minutes
                          </option>

                          <option value={30}>
                            30 minutes
                          </option>

                          <option value={45}>
                            45 minutes
                          </option>

                          <option value={60}>
                            1 hour
                          </option>

                          <option value={90}>
                            1.5 hours
                          </option>

                          <option value={120}>
                            2 hours
                          </option>
                        </select>
                      </div>

                      {/* Interview Type */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Interview Type
                        </label>

                        <select
                          name="interviewType"
                          value={formData.interviewType}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 text-sm text-gray-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
                        >
                          <option value="Online">
                            Online
                          </option>

                          <option value="Offline">
                            Offline
                          </option>

                          <option value="Phone">
                            Phone
                          </option>
                        </select>
                      </div>

                      {/* Interview Location / Link */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          {formData.interviewType === "Online"
                            ? "Meeting Link"
                            : "Location"}
                        </label>

                        <div className="relative">
                          {formData.interviewType ===
                          "Online" ? (
                            <Video
                              size={15}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                          ) : (
                            <MapPin
                              size={15}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                          )}

                          <input
                            type="text"
                            name="interviewLocation"
                            value={
                              formData.interviewLocation
                            }
                            onChange={handleChange}
                            placeholder={
                              formData.interviewType ===
                              "Online"
                                ? "https://meet.google.com/..."
                                : "Company Office, Jaipur"
                            }
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
                          />
                        </div>
                      </div>

                      {/* Interview Notes */}
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Interview Notes
                        </label>

                        <textarea
                          name="interviewNotes"
                          value={formData.interviewNotes}
                          onChange={handleChange}
                          placeholder="Add preparation notes, topics to revise, recruiter instructions..."
                          rows={4}
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ========================================
                  Tags & Notes
              ======================================== */}
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
                        Add tags and notes to find this application
                        easily later
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
                          setTagInput(e.target.value)
                        }
                        onKeyDown={handleTagKeyDown}
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
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                          >
                            {tag}

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveTag(tag)
                              }
                              className="rounded-full p-0.5 text-indigo-400 transition hover:bg-indigo-100 hover:text-red-500"
                              aria-label={`Remove ${tag}`}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-2 text-[11px] text-gray-400">
                      Up to 10 tags. Press Enter or click Add.
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
                        placeholder="Add recruiter details, salary information, referral notes, preparation thoughts..."
                        rows={5}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================
                  Mobile / Bottom Actions
              ======================================== */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/applications")}
                  className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={16} />

                  {loading
                    ? "Adding Application..."
                    : "Add Application"}
                </button>
              </div>
            </div>

            {/* ========================================
                RIGHT - Summary / Tips
            ======================================== */}
            <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
              {/* Application Preview */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Application Preview
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-400">
                    A quick look at what you&apos;re adding
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
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-gray-400">
                          Status
                        </span>

                        <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
                          {formData.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-gray-400">
                          Job type
                        </span>

                        <span className="font-medium text-gray-700">
                          {formData.jobType}
                        </span>
                      </div>

                      {formData.location && (
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-gray-400">
                            Location
                          </span>

                          <span className="max-w-[170px] truncate font-medium text-gray-700">
                            {formData.location}
                          </span>
                        </div>
                      )}

                      {formData.followUpDate && (
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-gray-400">
                            Follow-up
                          </span>

                          <span className="font-medium text-gray-700">
                            {formData.followUpDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

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

              {/* Helpful Tips */}
              <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50">
                <div className="p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Sparkles
                      size={17}
                      className="text-indigo-600"
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-gray-900">
                    Keep your tracker useful
                  </h3>

                  <div className="mt-3 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-indigo-600"
                      />

                      <p className="text-xs leading-5 text-gray-600">
                        Add a follow-up date so important
                        applications don&apos;t get forgotten.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-indigo-600"
                      />

                      <p className="text-xs leading-5 text-gray-600">
                        Use tags such as React, Backend,
                        Remote or Priority.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-indigo-600"
                      />

                      <p className="text-xs leading-5 text-gray-600">
                        Save interview details now so you can
                        prepare before the meeting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Status */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock3
                    size={15}
                    className="text-gray-400"
                  />

                  <p className="text-xs font-semibold text-gray-700">
                    Current application stage
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        formData.status === "Applied"
                          ? "w-1/4 bg-blue-500"
                          : formData.status === "Interview"
                          ? "w-2/4 bg-amber-500"
                          : formData.status === "Offer"
                          ? "w-3/4 bg-violet-500"
                          : formData.status === "Selected"
                          ? "w-full bg-emerald-500"
                          : "w-0"
                      }`}
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  {formData.status === "Rejected"
                    ? "This application is marked as rejected."
                    : `Currently marked as ${formData.status}.`}
                </p>
              </div>

              {/* Desktop Submit */}
              <div className="hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm xl:block">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={16} />

                  {loading
                    ? "Adding Application..."
                    : "Add Application"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/applications")}
                  className="mt-2 h-10 w-full rounded-xl text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </aside>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddApplication;