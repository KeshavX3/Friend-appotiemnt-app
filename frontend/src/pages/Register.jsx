import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!name || !email || !password || !role) return "All fields are required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Invalid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      toast.error(err);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setLoading(false);
      toast.success("Registration successful!");
      window.dispatchEvent(new Event("userChanged"));
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed");
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div>
            <label className="block mb-1 font-medium text-blue-800">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-800">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-800">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-800">Role</label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="">Select role</option>
              <option value="user">User A</option>
              <option value="friend">User B</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold shadow"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
} 