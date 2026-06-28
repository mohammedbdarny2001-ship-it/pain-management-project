function DashboardPieChart({ title, description, data }) {
  const safeData = Array.isArray(data) ? data : [];
  const total = safeData.reduce((sum, item) => sum + Number(item.value || 0), 0);

  if (total === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h4 className="font-bold text-gray-800">{title}</h4>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        <p className="text-sm text-gray-500 mt-4">No data available.</p>
      </div>
    );
  }

  let cumulativePercent = 0;

  const gradientParts = safeData.map((item, index) => {
    const value = Number(item.value || 0);
    const percent = (value / total) * 100;
    const start = cumulativePercent;
    const end = cumulativePercent + percent;
    cumulativePercent = end;

    return `${getPieColor(index)} ${start}% ${end}%`;
  });

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="mb-4">
        <h4 className="font-bold text-gray-800">{title}</h4>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-5">
        <div
          className="w-44 h-44 rounded-full border border-gray-200"
          style={{
            background: `conic-gradient(${gradientParts.join(", ")})`,
          }}
        ></div>

        <div className="space-y-2 w-full">
          {safeData.map((item, index) => {
            const percent = Math.round((Number(item.value || 0) / total) * 100);

            return (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getPieColor(index) }}
                  ></span>

                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>

                <span className="text-gray-600">
                  {item.value} ({percent}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getPieColor(index) {
  const colors = [
    "#22c55e",
    "#f97316",
    "#ef4444",
    "#94a3b8",
    "#3b82f6",
    "#a855f7",
  ];

  return colors[index % colors.length];
}

export default DashboardPieChart;