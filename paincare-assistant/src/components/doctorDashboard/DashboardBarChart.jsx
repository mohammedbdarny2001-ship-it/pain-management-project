function DashboardBarChart({ title, description, data, valueSuffix = "" }) {
  const safeData = Array.isArray(data) ? data : [];
  const maxValue = Math.max(...safeData.map((item) => Number(item.value)), 1);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="mb-4">
        <h4 className="font-bold text-gray-800">{title}</h4>

        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      <div className="space-y-3">
        {safeData.map((item) => {
          const numericValue = Number(item.value);
          const width =
            numericValue === 0
              ? "0%"
              : `${Math.max((numericValue / maxValue) * 100, 8)}%`;

          return (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">
                  {item.label}
                </span>

                <span className="text-gray-600">
                  {item.value}
                  {valueSuffix}
                </span>
              </div>

              <div className="h-3 bg-white border border-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardBarChart;