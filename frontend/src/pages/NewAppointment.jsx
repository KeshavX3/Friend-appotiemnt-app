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
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Request New Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div>
            <label className="block mb-1 font-medium text-blue-800">Approver (Friend)</label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <label className="block mb-1 font-medium text-blue-800">Type</label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <label className="block mb-1 font-medium text-blue-800">Start Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-800">End Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-800">Note (optional)</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              placeholder="Add a note or message (optional)"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold shadow"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
} 