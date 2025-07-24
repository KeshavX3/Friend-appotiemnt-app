import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [delayReason, setDelayReason] = useState("");
  const [newTime, setNewTime] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    setLoading(true);
    api.get(`/appointments`)
      .then(res => {
        const found = res.data.find(a => a._id === id);
        setAppointment(found || null);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load appointment");
        setLoading(false);
      });
  }, [id]);

  // Fix: normalize approverId for comparison
  const approverId = appointment && typeof appointment.approverId === 'object'
    ? appointment.approverId._id
    : appointment?.approverId;
  const canAct = appointment && user && approverId === user.id && appointment.status === "pending";

  const handleAction = async (status) => {
    setActionLoading(true);
    setError("");
    try {
      let body = { status };
      if (status === "delayed") {
        if (!delayReason || !newTime) {
          setError("Delay reason and new time required");
          toast.error("Delay reason and new time required");
          setActionLoading(false);
          return;
        }
        body.delayReason = delayReason;
        body.newTime = newTime;
      }
      const res = await api.patch(`/appointments/${id}`, body);
      setAppointment(res.data);
      setActionLoading(false);
      toast.success(`Appointment ${status}!`);
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
      toast.error(err.response?.data?.message || "Action failed");
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-[80vh] text-red-500 bg-gradient-to-br from-blue-50 to-blue-100">{error}</div>;
  if (!appointment) return <div className="flex justify-center items-center min-h-[80vh] text-gray-500 bg-gradient-to-br from-blue-50 to-blue-100">Appointment not found.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100 px-2">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-blue-100 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Appointment Details</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-sm ${
            appointment.status === "approved"
              ? "bg-green-100 text-green-700"
              : appointment.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : appointment.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-50 text-yellow-800"
          }`}>
            {appointment.status}
          </span>
        </div>
        <div className="mb-2"><b>Type:</b> {appointment.type}</div>
        <div className="mb-2"><b>Start:</b> {new Date(appointment.startTime).toLocaleString()}</div>
        <div className="mb-2"><b>End:</b> {new Date(appointment.endTime).toLocaleString()}</div>
        <div className="mb-2"><b>Status:</b> <span className="capitalize">{appointment.status}</span></div>
        {appointment.note && <div className="mb-2"><b>Note:</b> {appointment.note}</div>}
        {appointment.status === "delayed" && (
          <div className="mb-2 text-yellow-700">
            <b>Delay Reason:</b> {appointment.delayReason}<br />
            <b>New Time:</b> {appointment.newTime ? new Date(appointment.newTime).toLocaleString() : ""}
          </div>
        )}
        {canAct && (
          <div className="mt-6 space-y-3">
            <button
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold shadow"
              disabled={actionLoading}
              onClick={() => handleAction("approved")}
            >
              {actionLoading ? "Processing..." : "Approve"}
            </button>
            <button
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-semibold shadow"
              disabled={actionLoading}
              onClick={() => handleAction("rejected")}
            >
              {actionLoading ? "Processing..." : "Reject"}
            </button>
            <div className="border-t pt-3">
              <div className="mb-2 font-medium text-blue-800">Propose Delay</div>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Reason for delay"
                value={delayReason}
                onChange={e => setDelayReason(e.target.value)}
              />
              <input
                type="datetime-local"
                className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
              />
              <button
                className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 font-semibold shadow"
                disabled={actionLoading}
                onClick={() => handleAction("delayed")}
              >
                {actionLoading ? "Processing..." : "Propose Delay"}
              </button>
            </div>
          </div>
        )}
        <button
          className="w-full mt-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-semibold shadow"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
} 