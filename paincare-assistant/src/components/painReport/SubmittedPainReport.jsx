function SubmittedPainReport({ report }) {
  if (!report) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <h3 className="font-bold text-green-700 mb-2">Report Submitted</h3>

      <p className="text-sm">
        <strong>Pain level:</strong> {report.painLevel}/10
      </p>

      <p className="text-sm">
        <strong>Location:</strong> {report.location}
      </p>

      <p className="text-sm">
        <strong>Pain type:</strong> {report.painType}
      </p>

      <p className="text-sm">
        <strong>Duration:</strong> {report.duration || "Not provided"}
      </p>

      <p className="text-sm">
        <strong>Medication taken:</strong> {report.medicationTaken}
      </p>

      <p className="text-sm">
        <strong>Submitted at:</strong>{" "}
        {report.submittedAt || new Date(report.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

export default SubmittedPainReport;