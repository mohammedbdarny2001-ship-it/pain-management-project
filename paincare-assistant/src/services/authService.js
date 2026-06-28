const API_URL = "http://localhost:5000/api/users";

export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}

export async function registerPatient(patientData) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: patientData.username,
        password: patientData.password,
        role: "patient",
        name: patientData.name,
        age: Number(patientData.age),
        diagnosis: patientData.diagnosis,
        physician: patientData.physician,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}

export async function updateUserProfile(username, profileData) {
  try {
    const response = await fetch(`${API_URL}/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Profile update failed",
      };
    }

    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}

export async function registerDoctor(doctorData) {
  try {
    const response = await fetch(`${API_URL}/register-doctor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: doctorData.username,
        password: doctorData.password,
        name: doctorData.name,
        specialization: doctorData.specialization,
        phone: doctorData.phone,
        email: doctorData.email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Doctor registration failed",
      };
    }

    return {
      success: true,
      doctor: data.doctor,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}