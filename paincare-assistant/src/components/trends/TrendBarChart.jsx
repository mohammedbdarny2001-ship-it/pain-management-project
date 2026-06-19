import { getBarHeight, formatReportDate } from "../../services/trendsService";

function TrendBarChart({ reports }) {
  if (!reports || reports.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600">
        No pain reports yet. Submit daily reports to see your pain trend.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="flex items-end gap-4 h-56 overflow-x-auto">
        {reports.map((report) => (
          <div
            key={report._id}
            className="flex flex-col items-center justify-end min-w-[70px]"
          >
            <div className="text-sm font-semibold text-gray-700 mb-1">
              {report.painLevel}/10
            </div>

            <div
              className="w-10 bg-blue-500 rounded-t-lg"
              style={{ height: `${getBarHeight(report.painLevel)}px` }}
              title={`${report.painLevel}/10`}
            ></div>

            <div className="text-xs text-gray-500 mt-2 text-center">
              {formatReportDate(report.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendBarChart;