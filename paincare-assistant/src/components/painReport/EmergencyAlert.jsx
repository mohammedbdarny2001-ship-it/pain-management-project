import { getEmergencyGuidance } from "../../services/painReportService";

function EmergencyAlert() {
  return (
    <div className="bg-red-50 border border-red-300 rounded-xl p-4">
      <h3 className="font-bold text-red-700 mb-1">High Pain Alert</h3>
      <p className="text-sm text-red-700">{getEmergencyGuidance()}</p>

      <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
        Contact Clinic
      </button>
    </div>
  );
}

export default EmergencyAlert;