
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  });

  const [tagInput, setTagInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      await API.post("/applications", formData);

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
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">
            JobTrack
          </h1>

          <button
            onClick={() => navigate("/applications")}
            className="text-gray-600 hover:text-indigo-600"
          >
            Back
          </button>
        </div>
      </nav>

      {/* Form */}
      <main className="max-w-3xl mx-auto p-6 page-enter">

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Add Application
          </h2>

          <p className="text-gray-500 mt-1">
            Add a new job application
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 hover-card">

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Company */}
            <div>
              <label className="block font-medium mb-2">
                Company
              </label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block font-medium mb-2">
                Position
              </label>

              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. Software Engineer Intern"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-medium mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Jaipur / Remote"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Job Type + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block font-medium mb-2">
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                  <option>Selected</option>
                </select>
              </div>

            </div>

            {/* Applied Date + Follow-up Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Applied Date */}
              <div>
                <label className="block font-medium mb-2">
                  Applied Date
                </label>

                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block font-medium mb-2">
                  Follow-up Date
                </label>

                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Set a date to remind yourself to follow up.
                </p>
              </div>

            </div>

            {/* Job URL */}
            <div>
              <label className="block font-medium mb-2">
                Job URL
              </label>

              <input
                type="url"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block font-medium mb-2">
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
                  placeholder="e.g. Java, React, Remote"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded-lg bg-gray-800 px-5 py-3 font-medium text-white transition hover:bg-gray-900"
                >
                  Add
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700"
                    >
                      {tag}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTag(tag)
                        }
                        className="ml-1 font-bold text-indigo-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500">
                Add up to 10 tags. Press Enter or click Add.
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-medium mb-2">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">

              <button
                type="button"
                onClick={() => navigate("/applications")}
                className="flex-1 border border-gray-300 rounded-lg py-3 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white rounded-lg py-3 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Application"}
              </button>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default AddApplication;

