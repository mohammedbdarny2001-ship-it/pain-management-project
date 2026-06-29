const API_URL = "https://pain-management.onrender.com/api/medications";

export async function addMedicationReminder(medicationData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicationData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to save medication reminder",
      };
    }

    return {
      success: true,
      medication: data.medication,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}

export async function getMedicationReminders(username) {
  try {
    const response = await fetch(`${API_URL}/${username}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        medications: [],
        message: data.message || "Failed to fetch medications",
      };
    }

    return {
      success: true,
      medications: data.medications,
    };
  } catch (error) {
    return {
      success: false,
      medications: [],
      message: "Cannot connect to server",
    };
  }
}

export async function markMedicationAsTaken(id) {
  try {
    const response = await fetch(`${API_URL}/${id}/taken`, {
      method: "PUT",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update medication",
      };
    }

    return {
      success: true,
      medication: data.medication,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}

export async function deleteMedicationReminder(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete medication",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}