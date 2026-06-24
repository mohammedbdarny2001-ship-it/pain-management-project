import { useUser } from "../../context/UserContext";
import Header from "../common/Header";
import DoctorDashboard from "../doctorDashboard/DoctorDashboard";

function DoctorHome() {
  const { currentUser, logout } = useUser();

  return (
    <div className="min-h-screen bg-slate-100">
      <Header role="doctor" />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-green-700">Doctor Area</h2>
            <p className="text-sm text-green-700">
              Welcome, {currentUser.name}. This page contains doctor-related features.
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Logout
          </button>
        </div>

        <DoctorDashboard />
      </main>
    </div>
  );
}

export default DoctorHome;
