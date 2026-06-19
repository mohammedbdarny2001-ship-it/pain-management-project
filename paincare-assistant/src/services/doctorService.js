const USERS_API_URL = "http://localhost:5000/api/users";
const PAIN_REPORTS_API_URL = "http://localhost:5000/api/pain-reports";

export async function getDoctorDashboardData() {
  try {
    const usersResponse = await fetch(USERS_API_URL);
    const reportsResponse = await fetch(PAIN_REPORTS_API_URL);

    const usersData = await usersResponse.json();
    const reportsData = await reportsResponse.json();

    if (!usersResponse.ok || !reportsResponse.ok) {
      return {
        success: false,
        message: "Failed to fetch doctor dashboard data",
        patients: [],
      };
    }

    const patients = usersData.users.filter((user) => user.role === "patient");
    const reports = reportsData.reports;

    const dashboardPatients = patients.map((patient) => {
      const patientReports = reports
        .filter((report) => report.patientUsername === patient.username)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const latestReport = patientReports[0];

      return {
        username: patient.username,
        name: patient.name,
        age: patient.age,
        diagnosis: patient.diagnosis,
        physician: patient.physician,
        reportsCount: patientReports.length,
        lastPain: latestReport ? latestReport.painLevel : null,
        lastLocation: latestReport ? latestReport.location : "No report",
        lastPainType: latestReport ? latestReport.painType : "No report",
        lastReportDate: latestReport ? latestReport.createdAt : null,
        medicationTaken: latestReport ? latestReport.medicationTaken : "No report",
        status: getPatientStatus(latestReport ? latestReport.painLevel : null),
      };
    });

    return {
      success: true,
      patients: dashboardPatients,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
      patients: [],
    };
  }
}

export function getPatientStatus(lastPain) {
  if (lastPain === null || lastPain === undefined) {
    return "No Reports";
  }

  if (Number(lastPain) >= 8) {
    return "High Alert";
  }

  if (Number(lastPain) >= 6) {
    return "Needs Follow-up";
  }

  return "Stable";
}

export function getTotalPatients(patients) {
  return patients.length;
}

export function getHighPainPatients(patients) {
  return patients.filter((patient) => Number(patient.lastPain) >= 8);
}

export function getAveragePainLevel(patients) {
  const patientsWithReports = patients.filter(
    (patient) => patient.lastPain !== null && patient.lastPain !== undefined
  );

  if (patientsWithReports.length === 0) {
    return 0;
  }

  const totalPain = patientsWithReports.reduce((sum, patient) => {
    return sum + Number(patient.lastPain);
  }, 0);

  return (totalPain / patientsWithReports.length).toFixed(1);
}

export function buildClinicalSummary(patients) {
  return patients.map((patient) => {
    const lastPain = patient.lastPain;
    const reportsCount = patient.reportsCount;

    let priority = "Low";
    let recommendation = "Continue routine monitoring.";

    if (lastPain === null || lastPain === undefined) {
      priority = "No Data";
      recommendation = "No pain reports submitted yet.";
    } else if (Number(lastPain) >= 8) {
      priority = "High";
      recommendation =
        "High pain level detected. Patient should be reviewed by medical staff.";
    } else if (Number(lastPain) >= 6) {
      priority = "Medium";
      recommendation =
        "Pain level is elevated. Follow-up is recommended.";
    } else {
      priority = "Low";
      recommendation =
        "Pain level is currently stable. Continue monitoring.";
    }

    return {
      username: patient.username,
      name: patient.name,
      diagnosis: patient.diagnosis,
      reportsCount,
      lastPain,
      status: patient.status,
      priority,
      recommendation,
    };
  });
}