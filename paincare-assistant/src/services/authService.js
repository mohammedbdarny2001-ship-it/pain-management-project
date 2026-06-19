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