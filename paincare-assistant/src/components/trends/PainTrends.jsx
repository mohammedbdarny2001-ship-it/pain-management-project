import { useEffect, useState } from "react";
import { getPainReportsByPatient } from "../../services/painReportService";
import {
  sortReportsByDate,
  getAveragePainLevel,
  getHighestPainReport,
} from "../../services/trendsService";
import TrendBarChart from "./TrendBarChart";
import { useUser } from "../../context/UserContext";

function PainTrends() {
  const { currentUser: user } = useUser();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPainReports() {
    setLoading(true);
    setError("");

    const result = await getPainReportsByPatient(user.username);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      setReports([]);
      return;
    }

    const sortedReports = sortReportsByDate(result.reports);
    setReports(sortedReports);
  }

  useEffect(() => {
    loadPainReports();
  }, []);

  const averagePain = getAveragePainLevel(reports);
  const highestPainReport = getHighestPainReport(reports);

  return (
    <section id="trends-section" className="bg-white rounded-2xl shadow p-6 scroll-mt-32">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-700">
            Pain Trends
          </h2>

          <p className="text-gray-600">
            View your pain history based on reports saved in MongoDB.
          </p>
        </div>

        <button
          onClick={loadPainReports}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh Trend
        </button>
      </div>

      {loading && (
        <p className="text-gray-600 font-medium">Loading pain trends...</p>
      )}

      {error && (
        <p className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700 font-medium">
                Total Reports
              </p>
              <p className="text-3xl font-bold text-blue-800">
                {reports.length}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-purple-700 font-medium">
                Average Pain
              </p>
              <p className="text-3xl font-bold text-purple-800">
                {averagePain}/10
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700 font-medium">
                Highest Pain
              </p>
              <p className="text-3xl font-bold text-red-800">
                {highestPainReport ? `${highestPainReport.painLevel}/10` : "-"}
              </p>
            </div>
          </div>

          <TrendBarChart reports={reports} />
        </>
      )}
    </section>
  );
}

export default PainTrends;