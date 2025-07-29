import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function NewAppointment() {
  const [approvers, setApprovers] = useState([]);
  const [approverId, setApproverId] = useState("");
  const [type, setType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch approvers (users with role 'friend')
  useEffect(() => {
    api.get("/auth/friends")
      .then(res => setApprovers(res.data))
      .catch(() => setApprovers([]));
  }, []);

  const validate = () => {
    if (!approverId || !type || !startTime || !endTime) return "All fields are required.";
    if (new Date(startTime) >= new Date(endTime)) return "End time must be after start time.";
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
      await api.post("/appointments", { approverId, type, startTime, endTime, note });
      setLoading(false);
      toast.success("Appointment created!");
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to create appointment");
      toast.error(err.response?.data?.message || "Failed to create appointment");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] font-quick">
      <div className="relative bg-white/80 backdrop-blur-lg p-10 rounded-super shadow-2xl border-2 border-pookiePink max-w-md w-full animate-float">
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-pulse" role="img" aria-label="sparkle">✨</span>
        <h2 className="text-3xl font-extrabold mb-6 text-pookiePink text-center tracking-tight">Request Appointment <span className='ml-1'>💞</span></h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-pookiePink text-sm text-center">{error}</div>}
          <div>
            <label className="block mb-1 font-semibold text-pookiePurple">Approver (Friend)</label>
            <select
              className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple"
              value={approverId}
              onChange={e => setApproverId(e.target.value)}
            >
              <option value="">Select friend</option>
              {approvers.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pookiePurple">Type</label>
            <select
              className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="chat">Online Chat</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pookiePurple">Start Time</label>
            <input
              type="datetime-local"
              className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pookiePurple">End Time</label>
            <input
              type="datetime-local"
              className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pookiePurple">Note (optional)</label>
            <textarea
              className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple placeholder-pookiePink"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              placeholder="Add a note or message (optional)"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pookiePink to-pookiePurple text-white py-3 rounded-pill font-bold shadow-lg hover:from-pookiePurple hover:to-pookiePink transition-all duration-300 border-2 border-pookieGlow animate-pulse text-lg"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Appointment ✨"}
          </button>
        </form>
      </div>
    </div>
  );
} 