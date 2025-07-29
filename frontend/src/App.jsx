import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewAppointment from "./pages/NewAppointment";
import AppointmentDetail from "./pages/AppointmentDetail";
import confetti from "canvas-confetti";

function AnimatedBackground({ dark }) {
  // Animated pastel or dark blobs and floating hearts
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden transition-colors duration-700 ${dark ? 'bg-gradient-to-br from-pookiePurple via-pookiePink to-pookieGlow' : ''}`}>
      {/* Blobs */}
      <div className={`absolute w-[600px] h-[600px] ${dark ? 'bg-pookiePurple' : 'bg-pastelPink'} opacity-60 rounded-full blur-3xl animate-float left-[-200px] top-[-200px]`} />
      <div className={`absolute w-[500px] h-[500px] ${dark ? 'bg-pookiePink' : 'bg-pastelPurple'} opacity-50 rounded-full blur-3xl animate-float right-[-150px] top-32`} />
      <div className={`absolute w-[400px] h-[400px] ${dark ? 'bg-pookieGlow' : 'bg-pastelBlue'} opacity-40 rounded-full blur-3xl animate-float left-1/2 bottom-[-200px]`} />
      {/* Floating hearts */}
      <span className="absolute left-1/4 top-1/3 text-4xl animate-float" role="img" aria-label="heart">💖</span>
      <span className="absolute right-1/3 top-1/4 text-3xl animate-float" role="img" aria-label="heart">💗</span>
      <span className="absolute left-1/2 bottom-1/4 text-5xl animate-float" role="img" aria-label="heart">💞</span>
      {/* Sparkles */}
      <span className="absolute left-10 top-10 text-2xl animate-pulse" role="img" aria-label="sparkle">✨</span>
      <span className="absolute right-20 top-32 text-3xl animate-pulse" role="img" aria-label="sparkle">🌟</span>
      <span className="absolute left-1/2 bottom-10 text-2xl animate-pulse" role="img" aria-label="sparkle">✨</span>
    </div>
  );
}

function FloatingMascot() {
  // Floating, clickable mascot that triggers confetti
  const [bouncing, setBouncing] = useState(false);
  const handleClick = () => {
    setBouncing(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#FF8DC7", "#E0BBFF", "#B5E0FF", "#FFF6B7", "#FFB6F9"]
    });
    setTimeout(() => setBouncing(false), 800);
  };
  return (
    <button
      className={`fixed bottom-8 right-8 z-50 text-5xl drop-shadow-lg transition-transform ${bouncing ? 'animate-bounce' : 'animate-float'}`}
      style={{ filter: "drop-shadow(0 0 16px #FF8DC7)" }}
      onClick={handleClick}
      title="Pookie Mascot! Click me for confetti!"
    >
      🍪<span className="ml-[-0.5rem] text-pookiePink text-3xl align-super">🎀</span>
    </button>
  );
}

function DarkModeToggle({ dark, setDark }) {
  return (
    <button
      className="fixed bottom-8 left-8 z-50 bg-white/70 backdrop-blur-lg rounded-pill px-4 py-2 shadow-lg border-2 border-pookiePink flex items-center gap-2 text-pookiePink font-bold hover:bg-pookiePink hover:text-white transition-all"
      onClick={() => setDark(d => !d)}
      title="Toggle dark mode"
    >
      <span className="text-2xl">{dark ? '🌙' : '💖'}</span> {dark ? 'Dark' : 'Light'}
    </button>
  );
}

function Navbar() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("userChanged", handler);
    return () => window.removeEventListener("userChanged", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-20 bg-white/60 backdrop-blur-lg shadow-lg p-4 flex flex-col md:flex-row justify-between items-center font-quick rounded-b-super border-b-2 border-pookiePink">
      <div className="flex items-center gap-2 font-extrabold text-2xl tracking-tight mb-2 md:mb-0 text-pookiePink drop-shadow">
        <span className="text-3xl animate-float" role="img" aria-label="cookie">🍪<span className="ml-[-0.5rem] text-pookiePink text-2xl align-super">🎀</span></span>
        <Link to="/dashboard" className="hover:underline font-quick text-pookiePink">PookieMeet</Link>
      </div>
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline font-semibold text-pookiePurple">Dashboard</Link>
            <Link to="/appointments/new" className="hover:underline font-semibold text-pookiePurple">New Appointment</Link>
            <span className="text-sm font-medium bg-pookiePink text-white px-4 py-1 rounded-pill ml-2 shadow font-quick">{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="ml-2 bg-gradient-to-r from-pookiePink to-pookiePurple text-white px-5 py-2 rounded-pill font-semibold shadow-lg hover:from-pookiePurple hover:to-pookiePink transition-all duration-300 border-2 border-pookieGlow animate-pulse">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline font-semibold text-pookiePurple">Login</Link>
            <Link to="/register" className="hover:underline font-semibold text-pookiePurple">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function RequireAuth({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  useEffect(() => {
    const handler = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("userChanged", handler);
    return () => window.removeEventListener("userChanged", handler);
  }, []);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const [dark, setDark] = useState(false);
  return (
    <Router>
      <div className={`relative min-h-screen font-quick ${dark ? 'bg-pookiePurple' : ''}`}>
        <AnimatedBackground dark={dark} />
        <FloatingMascot />
        <DarkModeToggle dark={dark} setDark={setDark} />
        <Navbar />
        <div className="p-4 min-h-[80vh] bg-transparent z-10 relative">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/appointments/new" element={<RequireAuth><NewAppointment /></RequireAuth>} />
            <Route path="/appointments/:id" element={<RequireAuth><AppointmentDetail /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
