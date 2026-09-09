import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password
      );

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };


return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 page-enter">

    <div className="w-full max-w-md bg-white border rounded-xl p-8 hover-card">

      {/* Branding */}
      <div className="text-center mb-7">
        <h1 className="text-3xl font-bold text-indigo-600">
          JobTrack
        </h1>

        <p className="text-gray-500 mt-2">
          Create your account
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Full Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters
          </p>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

      </form>

      {/* Login Link */}
      <p className="text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Login
        </Link>
      </p>

    </div>
  </div>
);


}

export default Register;