import { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PatientHome from "./components/patient/PatientHome";
import DoctorHome from "./components/doctor/DoctorHome";

function App() {
  const { currentUser } = useUser();
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    if (!currentUser) {
      setAuthMode("login");
    }
  }, [currentUser]);

  if (!currentUser && authMode === "register") {
    return <Register onShowLogin={() => setAuthMode("login")} />;
  }

  if (!currentUser) {
    return <Login onShowRegister={() => setAuthMode("register")} />;
  }

  if (currentUser.role === "patient") {
    return <PatientHome />;
  }

  if (currentUser.role === "doctor") {
    return <DoctorHome />;
  }

  return null;
}

export default App;
