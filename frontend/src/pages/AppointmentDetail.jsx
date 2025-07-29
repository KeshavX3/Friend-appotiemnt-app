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

  if (loading) return <div className="flex justify-center items-center min-h-[80vh] font-quick">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-[80vh] text-pookiePink font-quick">{error}</div>;
  if (!appointment) return <div className="flex justify-center items-center min-h-[80vh] text-pookiePurple font-quick">Appointment not found.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] font-quick">
      <div className="relative max-w-lg w-full bg-white/80 backdrop-blur-lg rounded-super shadow-2xl border-2 border-pookiePink p-10 animate-float">
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-pulse" role="img" aria-label="sparkle">🌟</span>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-pookiePink">Appointment Details <span className='ml-1'>💖</span></h2>
          <span className={`px-4 py-1 rounded-pill text-xs font-bold capitalize shadow-sm border-2 border-pookieGlow animate-pulse ${
            appointment.status === "approved"
              ? "bg-pastelMint text-pookiePurple"
              : appointment.status === "pending"
              ? "bg-pastelYellow text-pookiePink"
              : appointment.status === "rejected"
              ? "bg-pastelPink text-pookiePurple"
              : "bg-pastelPurple text-pookiePink"
          }`}>
            {appointment.status}
          </span>
        </div>
        <div className="mb-2"><b>Type:</b> <span className="text-pookiePurple">{appointment.type}</span></div>
        <div className="mb-2"><b>Start:</b> <span className="text-pookiePurple">{new Date(appointment.startTime).toLocaleString()}</span></div>
        <div className="mb-2"><b>End:</b> <span className="text-pookiePurple">{new Date(appointment.endTime).toLocaleString()}</span></div>
        <div className="mb-2"><b>Status:</b> <span className="capitalize text-pookiePink">{appointment.status}</span></div>
        {appointment.note && <div className="mb-2"><b>Note:</b> <span className="text-pookiePurple">{appointment.note}</span></div>}
        {appointment.status === "delayed" && (
          <div className="mb-2 text-pookiePink">
            <b>Delay Reason:</b> {appointment.delayReason}<br />
            <b>New Time:</b> {appointment.newTime ? new Date(appointment.newTime).toLocaleString() : ""}
          </div>
        )}
        {canAct && (
          <div className="mt-6 space-y-3">
            <button
              className="w-full bg-gradient-to-r from-pookiePink to-pookiePurple text-white py-3 rounded-pill font-bold shadow-lg hover:from-pookiePurple hover:to-pookiePink transition-all duration-300 border-2 border-pookieGlow animate-pulse text-lg"
              disabled={actionLoading}
              onClick={() => handleAction("approved")}
            >
              {actionLoading ? "Processing..." : "Approve 💖"}
            </button>
            <button
              className="w-full bg-gradient-to-r from-pastelPink to-pookiePink text-pookiePurple py-3 rounded-pill font-bold shadow-lg hover:from-pookiePurple hover:to-pookiePink transition-all duration-300 border-2 border-pookieGlow animate-pulse text-lg"
              disabled={actionLoading}
              onClick={() => handleAction("rejected")}
            >
              {actionLoading ? "Processing..." : "Reject 💔"}
            </button>
            <div className="border-t pt-3">
              <div className="mb-2 font-semibold text-pookiePurple">Propose Delay <span className='ml-1'>⏰</span></div>
              <input
                type="text"
                className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple placeholder-pookiePink"
                placeholder="Reason for delay"
                value={delayReason}
                onChange={e => setDelayReason(e.target.value)}
              />
              <input
                type="datetime-local"
                className="w-full border-2 border-pookiePink rounded-pill px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-pookiePurple bg-white/70 font-quick text-pookiePurple"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
              />
              <button
                className="w-full bg-gradient-to-r from-pookiePurple to-pookiePink text-white py-3 rounded-pill font-bold shadow-lg hover:from-pookiePink hover:to-pookiePurple transition-all duration-300 border-2 border-pookieGlow animate-pulse text-lg"
                disabled={actionLoading}
                onClick={() => handleAction("delayed")}
              >
                {actionLoading ? "Processing..." : "Propose Delay ⏳"}
              </button>
            </div>
          </div>
        )}
        <button
          className="w-full mt-6 bg-pastelPink text-pookiePurple py-3 rounded-pill font-bold shadow hover:bg-pookiePink hover:text-white transition-all duration-300 border-2 border-pookieGlow text-lg"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
} 