function PatientClinicalSummary({ summaries }) {
  function getPriorityClass(priority) {
    if (priority === "High") {
      return "bg-red-100 text-red-700";
    }

    if (priority === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (priority === "Low") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  if (!summaries || summaries.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Patient Clinical Summary
        </h3>
        <p className="text-gray-600">
          No patient data available for clinical summary.
        </p>
      </div>
    );
  }

  return (
    <div
      id="clinical-summary-section"
      className="bg-white border border-gray-200 rounded-xl p-5 mt-6 scroll-mt-32"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Patient Clinical Summary
      </h3>

      <p className="text-gray-600 mb-4">
        Automatic summary based on saved pain reports and patient status.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaries.map((summary) => (
          <div
            key={summary.username}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4"
          >
            <div className="flex justify-between items-start gap-3 mb-3">
              <div>
                <h4 className="font-bold text-gray-800">
                  {summary.name}
                </h4>

                <p className="text-sm text-gray-600">
                  Diagnosis: {summary.diagnosis || "Not specified"}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityClass(
                  summary.priority
                )}`}
              >
                {summary.priority} Priority
              </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Total Reports:</strong> {summary.reportsCount}
              </p>

              <p>
                <strong>Last Pain:</strong>{" "}
                {summary.lastPain !== null && summary.lastPain !== undefined
                  ? `${summary.lastPain}/10`
                  : "No report"}
              </p>

              <p>
                <strong>Status:</strong> {summary.status}
              </p>

              <p className="mt-3 bg-white border border-gray-200 rounded-lg p-3">
                <strong>Recommendation:</strong> {summary.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientClinicalSummary;