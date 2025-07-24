import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const FILTERS = ["All", "Upcoming", "Past", "Pending"];

function isPast(dateStr) {
  return new Date(dateStr) < new Date();
}
function isUpcoming(dateStr) {
  return new Date(dateStr) >= new Date();
}

export default function Dashboard() {
  const [filter, setFilter] = useState("All");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = () => {
      api.get("/appointments")
        .then(res => {
          if (isMounted) setAppointments(res.data);
          setLoading(false);
        })
        .catch(err => {
          if (isMounted) setError(err.response?.data?.message || "Failed to load appointments");
          setLoading(false);
        });
    };
    setLoading(true);
    fetchAppointments();
    // Fetch all friends for display
    api.get("/auth/friends").then(res => setUsers(res.data)).catch(() => {});
    const interval = setInterval(fetchAppointments, 10000); // every 10 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getUser = (id) => {
    if (!id) return null;
    if (user && user.id === id) return user;
    return users.find(u => u._id === id) || null;
  };

  const filtered = appointments.filter((appt) => {
    if (filter === "All") return true;
    if (filter === "Pending") return appt.status === "pending";
    if (filter === "Past") return isPast(appt.endTime);
    if (filter === "Upcoming") return isUpcoming(appt.startTime);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 md:px-0">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Your Appointments</h2>
      <div className="flex justify-center mb-8 gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`px-5 py-2 rounded-full border transition text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === f ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500">No appointments found.</div>
          )}
          {filtered.map(appt => {
            const requester = getUser(typeof appt.requesterId === 'object' ? appt.requesterId._id : appt.requesterId);
            const approver = getUser(typeof appt.approverId === 'object' ? appt.approverId._id : appt.approverId);
            return (
              <Link
                to={`/appointments/${appt._id}`}
                key={appt._id}
                className="block bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition p-5 border border-blue-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold capitalize text-lg text-blue-800">{appt.type}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-sm ${
                    appt.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : appt.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : appt.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-50 text-yellow-800"
                  }`}>
                    {appt.status}
                  </span>
                </div>
                <div className="text-gray-600 text-sm mb-1">
                  {new Date(appt.startTime).toLocaleString()} - {new Date(appt.endTime).toLocaleTimeString()}
                </div>
                <div className="text-gray-700 mb-2">{appt.note}</div>
                <div className="text-xs text-gray-500 mb-1">
                  <span>Requester: {requester ? `${requester.name} (${requester.email})` : appt.requesterId}</span><br />
                  <span>Approver: {approver ? `${approver.name} (${approver.email})` : appt.approverId}</span>
                </div>
                {appt.status === "delayed" && (
                  <div className="text-yellow-700 text-xs mt-1">
                    <b>Delayed:</b> {appt.delayReason} <br /><b>New Time:</b> {appt.newTime ? new Date(appt.newTime).toLocaleString() : ""}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
} 