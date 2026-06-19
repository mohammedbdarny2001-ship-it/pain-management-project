const API_URL = "http://localhost:5000/api/chatbot";

export async function sendChatMessage(message, patientContext = {}) {
  try {
    const response = await fetch(`${API_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        patientContext,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        reply: data.message || "The chatbot could not answer right now.",
      };
    }

    return {
      success: true,
      reply: data.reply,
      source: data.source,
    };
  } catch (error) {
    console.log("Chatbot service error:", error);

    return {
      success: false,
      reply:
        "The chatbot is currently unavailable. Please try again later or contact the medical staff if needed.",
    };
  }
}