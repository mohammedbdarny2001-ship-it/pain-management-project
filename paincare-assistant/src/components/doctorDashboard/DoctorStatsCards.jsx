function DoctorStatsCards({ totalPatients, highPainCount, averagePainLevel }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700 font-medium">Total Patients</p>
        <p className="text-3xl font-bold text-blue-800">{totalPatients}</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-700 font-medium">High Pain Alerts</p>
        <p className="text-3xl font-bold text-red-800">{highPainCount}</p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <p className="text-sm text-purple-700 font-medium">
          Average Last Pain
        </p>
        <p className="text-3xl font-bold text-purple-800">
          {averagePainLevel}/10
        </p>
      </div>
    </div>
  );
}

export default DoctorStatsCards;