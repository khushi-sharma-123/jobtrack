import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MapPin,
  Briefcase,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  Download,
  Filter,
  LayoutGrid,
  List,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  Gift,
  ChevronRight,
} from "lucide-react";

import API from "../services/api";
import KanbanBoard from "../components/KanbanBoard";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");

  const [activeFilters, setActiveFilters] = useState(false);

  // List / Kanban view
  const [viewMode, setViewMode] = useState("list");

  // CSV Export
  const [exporting, setExporting] = useState(false);

  // ==========================================
  // Fetch Applications
  // ==========================================
  const fetchApplications = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const hasFilters =
        filters.search ||
        filters.status ||
        filters.jobType ||
        filters.location;

      let response;

      if (hasFilters) {
        response = await API.get("/applications/search", {
          params: {
            search: filters.search || undefined,
            status: filters.status || undefined,
            jobType: filters.jobType || undefined,
            location: filters.location || undefined,
          },
        });
      } else {
        response = await API.get("/applications");
      }

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
  // Initial Load
  // ==========================================
  useEffect(() => {
    fetchApplications();
  }, []);

  // ==========================================
  // Search
  // ==========================================
  const handleSearch = (e) => {
    e.preventDefault();

    const filters = {
      search: search.trim(),
      status,
      jobType,
      location: location.trim(),
    };

    const hasAnyFilter =
      filters.search ||
      filters.status ||
      filters.jobType ||
      filters.location;

    setActiveFilters(Boolean(hasAnyFilter));
    fetchApplications(filters);
  };

  // ==========================================
  // Individual Filter Change
  // ==========================================
  const handleFilterChange = (type, value) => {
    let updatedSearch = search;
    let updatedStatus = status;
    let updatedJobType = jobType;
    let updatedLocation = location;

    if (type === "status") {
      updatedStatus = value;
      setStatus(value);
    }

    if (type === "jobType") {
      updatedJobType = value;
      setJobType(value);
    }

    const filters = {
      search: updatedSearch.trim(),
      status: updatedStatus,
      jobType: updatedJobType,
      location: updatedLocation.trim(),
    };

    const hasAnyFilter =
      filters.search ||
      filters.status ||
      filters.jobType ||
      filters.location;

    setActiveFilters(Boolean(hasAnyFilter));
    fetchApplications(filters);
  };

  // ==========================================
  // Clear Filters
  // ==========================================
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setJobType("");
    setLocation("");
    setActiveFilters(false);

    fetchApplications();
  };

  // ==========================================
  // Export Applications as CSV
  // ==========================================
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      setError("");

      const response = await API.get(
        "/applications/export/csv",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "text/csv",
        })
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "JobTrack_Applications.csv"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to export applications"
      );
    } finally {
      setExporting(false);
    }
  };

  // ==========================================
  // Delete Application
  // ==========================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await API.delete(`/applications/${id}`);

      setApplications((prev) =>
        prev.filter(
          (application) => application._id !== id
        )
      );
    } catch (err) {
      console.error("Delete application error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete application"
      );
    }
  };

  // ==========================================
  // Status Helpers
  // ==========================================
  const getStatusStyle = (statusValue) => {
    switch (statusValue) {
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Interview":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Offer":
        return "bg-violet-50 text-violet-700 border-violet-200";

      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusDot = (statusValue) => {
    switch (statusValue) {
      case "Applied":
        return "bg-blue-500";

      case "Interview":
        return "bg-amber-500";

      case "Offer":
        return "bg-violet-500";

      case "Selected":
        return "bg-emerald-500";

      case "Rejected":
        return "bg-red-500";

      default:
        return "bg-gray-400";
    }
  };

  // ==========================================
  // Stats
  // ==========================================
  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (application) => application.status === "Applied"
  ).length;

  const interviewCount = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const offerCount = applications.filter(
    (application) => application.status === "Offer"
  ).length;

  const selectedCount = applications.filter(
    (application) => application.status === "Selected"
  ).length;

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

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">
              Dashboard
            </span>
          </Link>
        </div>
      </nav>

      {/* ==========================================
          Main
      ========================================== */}
      <main className="mx-auto max-w-[1450px] px-4 py-7 sm:px-6 lg:px-8">
        {/* ==========================================
            Page Header
        ========================================== */}
        <div className="mb-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="transition hover:text-indigo-600"
                >
                  Dashboard
                </button>

                <ChevronRight size={13} />

                <span className="text-gray-500">
                  Applications
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-[34px]">
                My Applications
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500">
                Keep every application, interview and offer
                organized in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleExportCSV}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={16} />

                {exporting
                  ? "Exporting..."
                  : "Export CSV"}
              </button>

              <Link
                to="/applications/add"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
              >
                <Plus size={17} />
                Add Application
              </Link>
            </div>
          </div>
        </div>

        {/* ==========================================
            Stats
        ========================================== */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Total
              </span>

              <Briefcase
                size={17}
                className="text-gray-400"
              />
            </div>

            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              {totalApplications}
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              All applications
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700">
                Applied
              </span>

              <Clock3
                size={17}
                className="text-blue-500"
              />
            </div>

            <p className="mt-2 text-2xl font-bold tracking-tight text-blue-800">
              {appliedCount}
            </p>

            <p className="mt-1 text-[11px] text-blue-600">
              In progress
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700">
                Interviews
              </span>

              <CalendarDays
                size={17}
                className="text-amber-500"
              />
            </div>

            <p className="mt-2 text-2xl font-bold tracking-tight text-amber-800">
              {interviewCount}
            </p>

            <p className="mt-1 text-[11px] text-amber-600">
              Interview stage
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-violet-700">
                Offers
              </span>

              <Gift
                size={17}
                className="text-violet-500"
              />
            </div>

            <p className="mt-2 text-2xl font-bold tracking-tight text-violet-800">
              {offerCount}
            </p>

            <p className="mt-1 text-[11px] text-violet-600">
              Offer stage
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">
                Selected
              </span>

              <CheckCircle2
                size={17}
                className="text-emerald-500"
              />
            </div>

            <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-800">
              {selectedCount}
            </p>

            <p className="mt-1 text-[11px] text-emerald-600">
              Successful applications
            </p>
          </div>
        </div>

        {/* ==========================================
            Search / Filters
        ========================================== */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                <Filter
                  size={15}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Search & Filters
                </h2>

                <p className="text-[11px] text-gray-400">
                  Quickly narrow down your applications
                </p>
              </div>
            </div>

            {activeFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Clear all
              </button>
            )}
          </div>

          <form
            onSubmit={handleSearch}
            className="p-5"
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              {/* Search */}
              <div className="lg:col-span-5">
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Search
                </label>

                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by company or position..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="lg:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    handleFilterChange(
                      "status",
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="">
                    All Statuses
                  </option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">
                    Interview
                  </option>
                  <option value="Offer">Offer</option>
                  <option value="Selected">
                    Selected
                  </option>
                  <option value="Rejected">
                    Rejected
                  </option>
                </select>
              </div>

              {/* Job Type */}
              <div className="lg:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Job Type
                </label>

                <select
                  value={jobType}
                  onChange={(e) =>
                    handleFilterChange(
                      "jobType",
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="">
                    All Job Types
                  </option>
                  <option value="Full-time">
                    Full-time
                  </option>
                  <option value="Part-time">
                    Part-time
                  </option>
                  <option value="Internship">
                    Internship
                  </option>
                  <option value="Contract">
                    Contract
                  </option>
                </select>
              </div>

              {/* Location */}
              <div className="lg:col-span-3">
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="Jaipur, Remote..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 lg:col-span-12">
                <button
                  type="submit"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:flex-none"
                >
                  <Search size={15} />
                  Search Applications
                </button>

                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={
                    !activeFilters &&
                    !search &&
                    !status &&
                    !jobType &&
                    !location
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={15} />
                  <span className="hidden sm:inline">
                    Clear
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ==========================================
            Error
        ========================================== */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==========================================
            Loading
        ========================================== */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

            <p className="text-sm font-medium text-gray-700">
              Loading applications...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Preparing your application workspace
            </p>
          </div>
        ) : applications.length === 0 ? (
          /* ==========================================
              Empty State
          ========================================== */
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative px-6 py-16 text-center">
              <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-indigo-100/40 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                  <Briefcase
                    size={25}
                    className="text-indigo-600"
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-gray-900">
                  {activeFilters
                    ? "No applications found"
                    : "Your application tracker is empty"}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  {activeFilters
                    ? "Try changing your search or filters to find more applications."
                    : "Start tracking your job search by adding your first application to JobTrack."}
                </p>

                {activeFilters ? (
                  <button
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                ) : (
                  <Link
                    to="/applications/add"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Plus size={17} />
                    Add Your First Application
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ==========================================
                Results Header
            ========================================== */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {activeFilters
                    ? "Filtered applications"
                    : "All applications"}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-600">
                    {applications.length}
                  </span>{" "}
                  {applications.length === 1
                    ? "application"
                    : "applications"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {activeFilters && (
                  <button
                    onClick={clearFilters}
                    className="hidden text-xs font-semibold text-indigo-600 hover:text-indigo-700 sm:block"
                  >
                    Clear filters
                  </button>
                )}

                {/* View Toggle */}
                <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      viewMode === "list"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <List size={14} />
                    List
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("kanban")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      viewMode === "kanban"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <LayoutGrid size={14} />
                    Kanban
                  </button>
                </div>
              </div>
            </div>

            {/* ==========================================
                Kanban
            ========================================== */}
            {viewMode === "kanban" ? (
              <div className="rounded-2xl">
                <KanbanBoard
                  applications={applications}
                  setApplications={setApplications}
                />
              </div>
            ) : (
              /* ==========================================
                  List / Cards
              ========================================== */
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/40"
                  >
                    {/* Card Top */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-[17px] font-semibold tracking-tight text-gray-900">
                            {application.position}
                          </h2>

                          <p className="mt-1 text-sm font-medium text-indigo-600">
                            {application.company}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                            application.status
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              application.status
                            )}`}
                          />

                          {application.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-5 space-y-2">
                        {application.location && (
                          <div className="flex items-center gap-2.5 text-sm text-gray-600">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                              <MapPin
                                size={14}
                                className="text-gray-400"
                              />
                            </div>

                            <span className="truncate">
                              {application.location}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                            <Briefcase
                              size={14}
                              className="text-gray-400"
                            />
                          </div>

                          <span>
                            {application.jobType}
                          </span>
                        </div>

                        {application.appliedDate && (
                          <div className="flex items-center gap-2.5 text-xs text-gray-400">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                              <CalendarDays
                                size={13}
                                className="text-gray-400"
                              />
                            </div>

                            <span>
                              Applied on{" "}
                              {new Date(
                                application.appliedDate
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="my-4 border-t border-gray-100" />

                      {/* View */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/applications/${application._id}`
                          )
                        }
                        className="group/view flex w-full items-center justify-between rounded-xl bg-gray-50 px-3.5 py-2.5 text-left transition hover:bg-indigo-50"
                      >
                        <span className="text-xs font-semibold text-gray-600 group-hover/view:text-indigo-700">
                          View application details
                        </span>

                        <ChevronRight
                          size={15}
                          className="text-gray-400 transition group-hover/view:translate-x-0.5 group-hover/view:text-indigo-600"
                        />
                      </button>
                    </div>

                    {/* Bottom Actions */}
                    <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3.5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/applications/edit/${application._id}`
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(application._id)
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Applications;