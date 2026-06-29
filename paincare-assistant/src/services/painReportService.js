const API_URL = "https://pain-management.onrender.com/api/pain-reports";

export async function savePainReport(reportData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to save pain report",
      };
    }

    return {
      success: true,
      report: data.report,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}

export async function getPainReportsByPatient(username) {
  try {
    const response = await fetch(`${API_URL}/${username}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        reports: [],
        message: data.message || "Failed to fetch pain reports",
      };
    }

    return {
      success: true,
      reports: data.reports,
    };
  } catch (error) {
    return {
      success: false,
      reports: [],
      message: "Cannot connect to server",
    };
  }
}

export function isHighPainLevel(painLevel) {
  return Number(painLevel) >= 8;
}

export function getEmergencyGuidance() {
  return "Pain level 8 or above requires following the clinic emergency instructions and contacting the medical staff.";
}

export function getSelfRecommendation(report) {
  const painLevel = Number(report.painLevel);
  const painType = report.painType;
  const medicationTaken = report.medicationTaken;

  if (painLevel >= 8) {
    return {
      title: "High Pain Guidance",
      message:
        "Your pain level is high. Please follow the clinic emergency instructions and contact medical staff if the pain continues or worsens.",
    };
  }

  if (painType === "Burning") {
    return {
      title: "Burning Pain Recommendation",
      message:
        "Try relaxation breathing, avoid activities that trigger the pain, and continue monitoring whether the burning sensation changes during the day.",
    };
  }

  if (painType === "Pressing") {
    return {
      title: "Pressing Pain Recommendation",
      message:
        "Try resting in a comfortable position, check your posture, and document whether pressure increases during movement or sitting.",
    };
  }

  if (painType === "Stabbing" || painType === "Sharp") {
    return {
      title: "Sharp Pain Recommendation",
      message:
        "Avoid sudden movements, monitor the pain closely, and report to medical staff if the pain becomes stronger or appears suddenly.",
    };
  }

  if (painType === "Dull") {
    return {
      title: "Dull Pain Recommendation",
      message:
        "Gentle movement, stretching, and relaxation may help. Continue documenting the pain trend over time.",
    };
  }

  if (medicationTaken === "No" && painLevel >= 6) {
    return {
      title: "Medication Reminder",
      message:
        "You reported elevated pain and did not take medication. Please follow your prescribed medication plan if relevant.",
    };
  }

  return {
    title: "General Recommendation",
    message:
      "Continue tracking your symptoms daily. Consistent reports help the medical staff understand your pain pattern.",
  };
}