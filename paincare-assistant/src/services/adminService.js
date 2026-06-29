const API_URL = "https://pain-management.onrender.com/api/users";

export async function getUsersByRole(role) {
  try {
    const response = await fetch(`${API_URL}/by-role/${role}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch users",
        users: [],
      };
    }

    return {
      success: true,
      users: data.users,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
      users: [],
    };
  }
}

export async function createUserByAdmin(adminUsername, userData) {
  try {
    const response = await fetch(`${API_URL}/admin/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adminUsername,
        ...userData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to create user",
      };
    }

    return {
      success: true,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}

export async function deleteUserByAdmin(adminUsername, username) {
  try {
    const response = await fetch(`${API_URL}/admin/${username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminUsername }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete user",
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}

export async function assignDoctorToPatient(
  adminUsername,
  patientUsername,
  doctorUsername
) {
  try {
    const response = await fetch(`${API_URL}/admin/assign-doctor`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adminUsername,
        patientUsername,
        doctorUsername,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to assign doctor",
      };
    }

    return {
      success: true,
      message: data.message,
      patient: data.patient,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}