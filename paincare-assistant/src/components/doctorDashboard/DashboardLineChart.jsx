function DashboardLineChart({ title, description, data, valueSuffix = "" }) {
  const safeData = Array.isArray(data) ? data : [];
  const chartWidth = 420;
  const chartHeight = 220;
  const padding = 36;

  const values = safeData.map((item) => Number(item.value || 0));
  const maxValue = Math.max(...values, 10);
  const minValue = 0;

  const points = safeData.map((item, index) => {
    const x =
      safeData.length === 1
        ? chartWidth / 2
        : padding +
          (index * (chartWidth - padding * 2)) / (safeData.length - 1);

    const y =
      chartHeight -
      padding -
      ((Number(item.value || 0) - minValue) / (maxValue - minValue)) *
        (chartHeight - padding * 2);

    return {
      ...item,
      x,
      y,
    };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="mb-4">
        <h4 className="font-bold text-gray-800">{title}</h4>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>

      {safeData.length === 0 ? (
        <p className="text-sm text-gray-500">No data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full min-w-[360px]"
          >
            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#22c55e"
                  stroke="white"
                  strokeWidth="2"
                />

                <text
                  x={point.x}
                  y={point.y - 10}
                  textAnchor="middle"
                  className="fill-gray-700 text-xs font-semibold"
                >
                  {point.value}
                  {valueSuffix}
                </text>

                <text
                  x={point.x}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className="fill-gray-600 text-[10px]"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}

export default DashboardLineChart;