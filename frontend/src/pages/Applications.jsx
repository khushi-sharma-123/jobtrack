
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
  // Status Badge
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

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </div>
      </nav>

      {/* ==========================================
          Main Content
      ========================================== */}
      <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ==========================================
            Header
        ========================================== */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Applications
            </h1>

            <p className="mt-1 text-gray-500">
              Manage and track all your job applications.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={18} />

              {exporting
                ? "Exporting..."
                : "Export CSV"}
            </button>

            <Link
              to="/applications/add"
              className="flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Application
            </Link>
          </div>
        </div>

        {/* ==========================================
            Search & Filters
        ========================================== */}
        <div className="mb-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Search
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search company or position..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              <div className="lg:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="e.g. Jaipur, Bangalore, Remote..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  <Search size={17} />
                  Search
                </button>
              </div>

              {/* Clear Button */}
              <div className="flex items-end">
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
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={17} />
                  Clear Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ==========================================
            Error
        ========================================== */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==========================================
            Loading
        ========================================== */}
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

            <p className="text-gray-500">
              Loading applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          /* ==========================================
              Empty State
          ========================================== */
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
              <Briefcase
                size={26}
                className="text-indigo-600"
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              {activeFilters
                ? "No applications found"
                : "No applications yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {activeFilters
                ? "Try changing your search or filters to find more applications."
                : "Start tracking your job search by adding your first application."}
            </p>

            {activeFilters ? (
              <button
                onClick={clearFilters}
                className="mt-5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/applications/add"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <Plus size={17} />
                Add Application
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* ==========================================
                Result Count + View Toggle
            ========================================== */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {applications.length}
                </span>{" "}
                {applications.length === 1
                  ? "application"
                  : "applications"}
              </p>

              <div className="flex items-center gap-3">
                {activeFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Clear filters
                  </button>
                )}

                {/* View Toggle */}
                <div className="flex rounded-lg border border-gray-300 bg-white p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      viewMode === "list"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    List
                  </button>

                  <button
                    onClick={() => setViewMode("kanban")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      viewMode === "kanban"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Kanban
                  </button>
                </div>
              </div>
            </div>

            {/* ==========================================
                Kanban View
            ========================================== */}
            {viewMode === "kanban" ? (
              <KanbanBoard
                applications={applications}
                setApplications={setApplications}
              />
            ) : (
              /* ==========================================
                  List / Card View
              ========================================== */
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="hover-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {application.position}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-indigo-600">
                          {application.company}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="mt-5 space-y-2.5">
                      {application.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin
                            size={16}
                            className="text-gray-400"
                          />

                          <span>
                            {application.location}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase
                          size={16}
                          className="text-gray-400"
                        />

                        <span>
                          {application.jobType}
                        </span>
                      </div>

                      {application.appliedDate && (
                        <p className="text-xs text-gray-400">
                          Applied on{" "}
                          {new Date(
                            application.appliedDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* View Details */}
                    <button
                      onClick={() =>
                        navigate(
                          `/applications/${application._id}`
                        )
                      }
                      className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Details
                    </button>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/applications/edit/${application._id}`
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(application._id)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
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

