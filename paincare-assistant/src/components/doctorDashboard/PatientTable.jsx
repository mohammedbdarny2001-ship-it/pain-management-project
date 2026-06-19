function PatientTable({ patients }) {
  function getStatusClass(status) {
    if (status === "High Alert") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Needs Follow-up") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Stable") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "No report";
    }

    return new Date(dateValue).toLocaleString();
  }

  if (patients.length === 0) {
    return (
      <p className="text-gray-600 bg-gray-50 border rounded-lg p-4">
        No patients found in the database.
      </p>
    );
  }

  return (
    <div id="patients-section" className="scroll-mt-32">
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        Patient Status Table
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-3">Patient</th>
              <th className="border p-3">Age</th>
              <th className="border p-3">Diagnosis</th>
              <th className="border p-3">Last Pain</th>
              <th className="border p-3">Location</th>
              <th className="border p-3">Reports</th>
              <th className="border p-3">Last Report</th>
              <th className="border p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr key={patient.username} className="hover:bg-gray-50">
                <td className="border p-3 font-medium">{patient.name}</td>
                <td className="border p-3">{patient.age || "-"}</td>
                <td className="border p-3">{patient.diagnosis || "-"}</td>
                <td className="border p-3">
                  {patient.lastPain !== null ? `${patient.lastPain}/10` : "-"}
                </td>
                <td className="border p-3">{patient.lastLocation}</td>
                <td className="border p-3">{patient.reportsCount}</td>
                <td className="border p-3">
                  {formatDate(patient.lastReportDate)}
                </td>
                <td className="border p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                      patient.status
                    )}`}
                  >
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientTable;