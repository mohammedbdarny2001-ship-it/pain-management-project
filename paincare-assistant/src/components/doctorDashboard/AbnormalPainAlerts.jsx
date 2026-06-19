function AbnormalPainAlerts({ patients }) {
  if (patients.length === 0) {
    return (
      <div
        id="pain-alerts-section"
        className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 scroll-mt-32"
      >
        <h3 className="font-bold text-green-700 mb-1">
          Abnormal Pain Alerts
        </h3>

        <p className="text-green-700">
          No high pain alerts at the moment.
        </p>
      </div>
    );
  }

  return (
    <div
      id="pain-alerts-section"
      className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 scroll-mt-32"
    >
      <h3 className="font-bold text-red-700 mb-3">
        Abnormal Pain Alerts
      </h3>

      <div className="space-y-3">
        {patients.map((patient) => (
          <div
            key={patient.username}
            className="bg-white border border-red-200 rounded-lg p-3"
          >
            <p className="font-semibold text-red-700">
              {patient.name} reported high pain level: {patient.lastPain}/10
            </p>

            <p className="text-sm text-gray-600">
              Location: {patient.lastLocation} | Type: {patient.lastPainType}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AbnormalPainAlerts;