import { useState } from "react";
import {
  savePainReport,
  isHighPainLevel,
  getSelfRecommendation,
} from "../../services/painReportService";
import { useUser } from "../../context/UserContext";
import EmergencyAlert from "./EmergencyAlert";
import PainReportForm from "./PainReportForm";
import SubmittedPainReport from "./SubmittedPainReport";

function DailyPainReport() {
  const { currentUser: user } = useUser();
  const [formData, setFormData] = useState({
    painLevel: 5,
    location: "",
    painType: "",
    duration: "",
    medicationTaken: "No",
    notes: "",
  });

  const [submittedReport, setSubmittedReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.location || !formData.painType || !formData.duration) {
      setError("Please fill in pain location, type and duration");
      return;
    }

    setLoading(true);
    setError("");

    const reportData = {
      patientUsername: user.username,
      painLevel: Number(formData.painLevel),
      location: formData.location,
      painType: formData.painType,
      duration: formData.duration,
      medicationTaken: formData.medicationTaken,
      notes: formData.notes,
    };

    const result = await savePainReport(reportData);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSubmittedReport(result.report);
    setRecommendation(getSelfRecommendation(result.report));

    setFormData({
      painLevel: 5,
      location: "",
      painType: "",
      duration: "",
      medicationTaken: "No",
      notes: "",
    });
  }

  return (
    <section id="pain-report-section" className="bg-white rounded-2xl shadow p-6 scroll-mt-32">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        Daily Pain Report
      </h2>

      <p className="text-gray-600 mb-6">
        Record your daily pain level and symptoms. The report will be saved for
        medical staff review.
      </p>

      {isHighPainLevel(formData.painLevel) && <EmergencyAlert />}

      <PainReportForm
        reportData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />

      <SubmittedPainReport report={submittedReport} />
      {recommendation && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          <p className="font-bold">{recommendation.title}</p>
          <p>{recommendation.message}</p>
        </div>
        )}
    </section>
  );
}

export default DailyPainReport;