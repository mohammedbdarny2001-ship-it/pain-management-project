import { useState } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PatientHome from "./components/patient/PatientHome";
import DoctorHome from "./components/doctor/DoctorHome";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  function handleLogin(user) {
    setCurrentUser(user);
  }

  function handleRegister(user) {
    setCurrentUser(user);
  }

  function handleLogout() {
    setCurrentUser(null);
    setAuthMode("login");
  }

  if (!currentUser && authMode === "register") {
    return (
      <Register
        onRegister={handleRegister}
        onShowLogin={() => setAuthMode("login")}
      />
    );
  }

  if (!currentUser) {
    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setAuthMode("register")}
      />
    );
  }

  if (currentUser.role === "patient") {
    return <PatientHome user={currentUser} onLogout={handleLogout} />;
  }

  if (currentUser.role === "doctor") {
    return <DoctorHome user={currentUser} onLogout={handleLogout} />;
  }

  return null;
}

export default App;