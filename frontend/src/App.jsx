import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewAppointment from "./pages/NewAppointment";
import AppointmentDetail from "./pages/AppointmentDetail";

function Navbar() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-20 bg-blue-700 text-white p-4 flex flex-col md:flex-row justify-between items-center shadow-md">
      <div className="font-extrabold text-2xl tracking-tight mb-2 md:mb-0">
        <Link to="/dashboard" className="hover:underline">Appoint<span className="text-blue-200">Mate</span></Link>
      </div>
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/appointments/new" className="hover:underline">New Appointment</Link>
            <span className="text-sm font-medium bg-blue-600 px-2 py-1 rounded ml-2">{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="ml-2 bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-100 font-semibold">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function RequireAuth({ children }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/appointments/new" element={<RequireAuth><NewAppointment /></RequireAuth>} />
          <Route path="/appointments/:id" element={<RequireAuth><AppointmentDetail /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
