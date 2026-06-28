import { useState } from "react";
import { useUser } from "../../context/UserContext";
import Header from "../common/Header";
import DailyPainReport from "../painReport/DailyPainReport";
import MedicationReminder from "../medication/MedicationReminder";
import PainAssistantChatbot from "../chatbot/PainAssistantChatbot";
import PainTrends from "../trends/PainTrends";
import PatientDoctorNotes from "./PatientDoctorNotes";
import PersonalProfilePage from "../profile/PersonalProfilePage";

function PatientHome() {
  const { currentUser, logout } = useUser();
  const [showPersonalArea, setShowPersonalArea] = useState(false);

  if (showPersonalArea) {
    return <PersonalProfilePage onBack={() => setShowPersonalArea(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        role="patient"
        onOpenPersonalArea={() => setShowPersonalArea(true)}
      />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-blue-700">Patient Area</h2>
            <p className="text-sm text-blue-700">
              Welcome, {currentUser.name}. This page contains patient-related
              features.
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Logout
          </button>
        </div>

        <DailyPainReport />
        <MedicationReminder />
        <PatientDoctorNotes />
        <PainAssistantChatbot />
        <PainTrends />
      </main>
    </div>
  );
}

export default PatientHome;