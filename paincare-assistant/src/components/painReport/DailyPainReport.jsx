import { useState } from "react";
import {
  savePainReport,
  isHighPainLevel,
  getEmergencyGuidance,
  getSelfRecommendation,
} from "../../services/painReportService";

function DailyPainReport({ user }) {
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Pain Level: {formData.painLevel}/10
          </label>
          <input
            type="range"
            name="painLevel"
            min="0"
            max="10"
            value={formData.painLevel}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {isHighPainLevel(formData.painLevel) && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-4">
            <p className="font-bold">Emergency Alert</p>
            <p>{getEmergencyGuidance()}</p>
          </div>
        )}

        <div>
          <label className="block font-medium mb-1">Pain Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Example: Lower back"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Pain Type</label>
          <select
            name="painType"
            value={formData.painType}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select pain type</option>
            <option value="Burning">Burning</option>
            <option value="Pressing">Pressing</option>
            <option value="Stabbing">Stabbing</option>
            <option value="Sharp">Sharp</option>
            <option value="Dull">Dull</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Duration</label>
          <input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Example: 45 minutes"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Medication Taken</label>
          <select
            name="medicationTaken"
            value={formData.medicationTaken}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            rows="3"
            placeholder="Describe anything important about today's pain"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Submit Pain Report"}
        </button>
      </form>

      {submittedReport && (
        <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4 text-green-700">
          <p className="font-bold">Pain report saved successfully</p>
          <p>
            Pain level: {submittedReport.painLevel}/10 | Location:{" "}
            {submittedReport.location}
          </p>
        </div>
      )}
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