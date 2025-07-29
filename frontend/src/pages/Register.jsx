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
    <div className="flex flex-col items-center justify-center min-h-[80vh] font-quick">
      <div className="relative bg-white/80 backdrop-blur-lg p-10 rounded-super shadow-2xl border-2 border-pookiePink max-w-sm w-full animate-float">
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-pulse" role="img" aria-label="heart">💗</span>
        <h2 className="text-3xl font-extrabold mb-6 text-pookiePink text-center tracking-tight">Create Account <span className='ml-1'>🎀</span></h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-pookiePink text-sm text-center">{error}</div>}
          <div>
            <label className="block mb-1 font-semibold text-pookiePurple">Name</label>
            <input
              type="text"
              className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple placeholder-pookiePink"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pookiePurple">Email</label>
            <input
              type="email"
              className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple placeholder-pookiePink"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pookiePurple">Password</label>
            <input
              type="password"
              className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple placeholder-pookiePink"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pookiePurple">Role</label>
            <select
              className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple"
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
            className="w-full bg-gradient-to-r from-pookiePink to-pookiePurple text-white py-3 rounded-pill font-bold shadow-lg hover:from-pookiePurple hover:to-pookiePink transition-all duration-300 border-2 border-pookieGlow animate-pulse text-lg"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register 🎀"}
          </button>
        </form>
        <div className="text-xs text-pookiePurple mt-6 text-center">
          Already have an account? <a href="/login" className="text-pookiePink hover:underline font-bold">Login</a>
        </div>
      </div>
    </div>
  );
} 