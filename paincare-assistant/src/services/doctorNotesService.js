const API_URL = "https://pain-management.onrender.com/api/doctor-notes";

export async function addDoctorNote(noteData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to save doctor note",
      };
    }

    return {
      success: true,
      note: data.note,
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to server",
    };
  }
}

export async function getDoctorNotesByPatient(username) {
  try {
    const response = await fetch(`${API_URL}/${username}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        notes: [],
        message: data.message || "Failed to fetch doctor notes",
      };
    }

    return {
      success: true,
      notes: data.notes,
    };
  } catch (error) {
    return {
      success: false,
      notes: [],
      message: "Cannot connect to server",
    };
  }
}