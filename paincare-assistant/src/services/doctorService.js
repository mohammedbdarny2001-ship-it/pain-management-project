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

export function buildDoctorAnalytics(patients, ageRiskLimit = 60) {
  const patientList = Array.isArray(patients) ? patients : [];
  const riskAge = Number(ageRiskLimit) || 60;

  const olderPatients = patientList.filter((patient) => {
    const age = Number(patient.age);
    return Number.isFinite(age) && age >= riskAge;
  });

  const teenPatients = patientList.filter((patient) => {
    const age = Number(patient.age);
    return Number.isFinite(age) && age >= 13 && age <= 19;
  });

  const underTeenPatients = patientList.filter((patient) => {
    const age = Number(patient.age);
    return Number.isFinite(age) && age > 0 && age < 13;
  });

  const adultPatients = patientList.filter((patient) => {
    const age = Number(patient.age);
    return Number.isFinite(age) && age >= 20 && age < riskAge;
  });

  const unknownAgePatients = patientList.filter((patient) => {
    const age = Number(patient.age);
    return !Number.isFinite(age) || age <= 0;
  });

  const followUpPatients = patientList.filter((patient) => {
    return (
      patient.status === "High Alert" ||
      patient.status === "Needs Follow-up"
    );
  });

  return {
    olderPatientsCount: olderPatients.length,
    teenPatientsCount: teenPatients.length,
    followUpPatientsCount: followUpPatients.length,

    ageGroups: [
      { label: "Children under 13", value: underTeenPatients.length },
      { label: "Teenagers 13-19", value: teenPatients.length },
      { label: `Adults 20-${riskAge - 1}`, value: adultPatients.length },
      { label: `Age ${riskAge}+`, value: olderPatients.length },
      { label: "Unknown age", value: unknownAgePatients.length },
    ],

    monitoringPriorityGroups: buildMonitoringPriorityGroups(
      patientList,
      riskAge
    ),

    
    statusGroups: buildStatusGroups(patientList),
    
    medicationGroups: buildMedicationGroups(patientList),
    recentReportGroups: buildRecentReportGroups(patientList),
    averagePainByAgeGroups: buildAveragePainByAgeGroups(patientList, riskAge),
  };
}

function buildMonitoringPriorityGroups(patients, riskAge) {
  const highPainPatients = patients.filter((patient) => {
    return hasPainReport(patient) && Number(patient.lastPain) >= 7;
  });

  const ageRiskPatients = patients.filter((patient) => {
    return Number(patient.age) >= riskAge;
  });

  const teenPatients = patients.filter((patient) => {
    const age = Number(patient.age);
    return age >= 13 && age <= 19;
  });

  const medicationNotTakenPatients = patients.filter((patient) => {
    return normalizeMedicationTaken(patient.medicationTaken) === "notTaken";
  });

  const lowReportActivityPatients = patients.filter((patient) => {
    return Number(patient.reportsCount) <= 1;
  });

  return [
    {
      label: "High pain 7+",
      value: highPainPatients.length,
    },
    {
      label: `Age ${riskAge}+`,
      value: ageRiskPatients.length,
    },
    {
      label: "Teenagers 13-19",
      value: teenPatients.length,
    },
    {
      label: "Medication not taken",
      value: medicationNotTakenPatients.length,
    },
    {
      label: "Low report activity",
      value: lowReportActivityPatients.length,
    },
  ];
}


function buildStatusGroups(patients) {
  return [
    {
      label: "High Alert",
      value: patients.filter((patient) => patient.status === "High Alert")
        .length,
    },
    {
      label: "Needs Follow-up",
      value: patients.filter(
        (patient) => patient.status === "Needs Follow-up"
      ).length,
    },
    {
      label: "Stable",
      value: patients.filter((patient) => patient.status === "Stable").length,
    },
    {
      label: "No Reports",
      value: patients.filter((patient) => patient.status === "No Reports")
        .length,
    },
  ];
}



function buildMedicationGroups(patients) {
  return [
    {
      label: "Medication taken",
      value: patients.filter((patient) => {
        return normalizeMedicationTaken(patient.medicationTaken) === "taken";
      }).length,
    },
    {
      label: "Medication not taken",
      value: patients.filter((patient) => {
        return normalizeMedicationTaken(patient.medicationTaken) === "notTaken";
      }).length,
    },
    {
      label: "No medication data",
      value: patients.filter((patient) => {
        return normalizeMedicationTaken(patient.medicationTaken) === "unknown";
      }).length,
    },
  ];
}

function hasPainReport(patient) {
  return patient.lastPain !== null && patient.lastPain !== undefined;
}

function normalizeMedicationTaken(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();

  if (normalizedValue === "yes") {
    return "taken";
  }

  if (normalizedValue === "no") {
    return "notTaken";
  }

  return "unknown";
}
function buildRecentReportGroups(patients) {
  const today = new Date();

  const reportedRecently = patients.filter((patient) => {
    if (!patient.lastReportDate) {
      return false;
    }

    const reportDate = new Date(patient.lastReportDate);
    const diffInMs = today - reportDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays <= 7;
  });

  const notReportedRecently = patients.filter((patient) => {
    if (!patient.lastReportDate) {
      return true;
    }

    const reportDate = new Date(patient.lastReportDate);
    const diffInMs = today - reportDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays > 7;
  });

  return [
    {
      label: "Reported in last 7 days",
      value: reportedRecently.length,
    },
    {
      label: "No recent report",
      value: notReportedRecently.length,
    },
  ];
}

function buildAveragePainByAgeGroups(patients, riskAge) {
  return [
    {
      label: "Under 13",
      value: calculateAveragePain(
        patients.filter((patient) => {
          const age = Number(patient.age);
          return Number.isFinite(age) && age > 0 && age < 13;
        })
      ),
    },
    {
      label: "13-19",
      value: calculateAveragePain(
        patients.filter((patient) => {
          const age = Number(patient.age);
          return Number.isFinite(age) && age >= 13 && age <= 19;
        })
      ),
    },
    {
      label: `20-${riskAge - 1}`,
      value: calculateAveragePain(
        patients.filter((patient) => {
          const age = Number(patient.age);
          return Number.isFinite(age) && age >= 20 && age < riskAge;
        })
      ),
    },
    {
      label: `${riskAge}+`,
      value: calculateAveragePain(
        patients.filter((patient) => {
          const age = Number(patient.age);
          return Number.isFinite(age) && age >= riskAge;
        })
      ),
    },
  ];
}

function calculateAveragePain(patients) {
  const patientsWithPain = patients.filter((patient) => {
    return patient.lastPain !== null && patient.lastPain !== undefined;
  });

  if (patientsWithPain.length === 0) {
    return 0;
  }

  const totalPain = patientsWithPain.reduce((sum, patient) => {
    return sum + Number(patient.lastPain);
  }, 0);

  return Number((totalPain / patientsWithPain.length).toFixed(1));
}