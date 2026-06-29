import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import {
  getDoctorDashboardData,
  getTotalPatients,
  getHighPainPatients,
  getAveragePainLevel,
  buildClinicalSummary,
} from "../../services/doctorService";
import DoctorStatsCards from "./DoctorStatsCards";
import AbnormalPainAlerts from "./AbnormalPainAlerts";
import PatientTable from "./PatientTable";
import DoctorNotesPanel from "./DoctorNotesPanel";
import PatientClinicalSummary from "./PatientClinicalSummary";
import DoctorAnalyticsCharts from "./DoctorAnalyticsCharts";

function DoctorDashboard() {
  const { currentUser } = useUser();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function isPatientAssignedToCurrentDoctor(patient) {
    if (!currentUser || !currentUser.name || !patient.physician) {
      return false;
    }

    return (
      patient.physician.trim().toLowerCase() ===
      currentUser.name.trim().toLowerCase()
    );
  }

  async function loadDashboardData() {
    setLoading(true);
    setError("");

    const result = await getDoctorDashboardData();

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      setPatients([]);
      return;
    }

    const assignedPatients = result.patients.filter((patient) => {
      return isPatientAssignedToCurrentDoctor(patient);
    });

    setPatients(assignedPatients);
  }

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const totalPatients = getTotalPatients(patients);
  const highPainPatients = getHighPainPatients(patients);
  const averagePainLevel = getAveragePainLevel(patients);
  const clinicalSummaries = buildClinicalSummary(patients);

  return (
    <section
      id="doctor-dashboard-section"
      className="bg-white rounded-2xl shadow p-6 scroll-mt-32"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-green-700">
            Doctor Dashboard
          </h2>
          <p className="text-gray-600">
            Review your assigned patients, pain reports, alerts and clinical
            status from MongoDB.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Refresh Data
        </button>
      </div>

      {loading && (
        <p className="text-gray-600 font-medium">Loading dashboard data...</p>
      )}

      {error && (
        <p className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <DoctorStatsCards
            totalPatients={totalPatients}
            highPainCount={highPainPatients.length}
            averagePainLevel={averagePainLevel}
          />

          <DoctorAnalyticsCharts patients={patients} />

          <AbnormalPainAlerts patients={highPainPatients} />

          <PatientTable patients={patients} />

          <PatientClinicalSummary summaries={clinicalSummaries} />

          <DoctorNotesPanel patients={patients} />
        </>
      )}
    </section>
  );
}

export default DoctorDashboard;