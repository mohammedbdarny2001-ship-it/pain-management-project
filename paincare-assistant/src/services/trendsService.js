export function getBarHeight(painLevel) {
  return Number(painLevel) * 18;
}

export function sortReportsByDate(reports) {
  return [...reports].sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

export function getAveragePainLevel(reports) {
  if (!reports || reports.length === 0) {
    return 0;
  }

  const total = reports.reduce((sum, report) => {
    return sum + Number(report.painLevel);
  }, 0);

  return (total / reports.length).toFixed(1);
}

export function getHighestPainReport(reports) {
  if (!reports || reports.length === 0) {
    return null;
  }

  return reports.reduce((highest, current) => {
    return Number(current.painLevel) > Number(highest.painLevel)
      ? current
      : highest;
  });
}

export function formatReportDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleDateString();
}