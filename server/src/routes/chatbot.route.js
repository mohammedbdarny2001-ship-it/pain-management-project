const express = require("express");

const router = express.Router();

function getFallbackResponse(message, patientContext) {
  const text = message.toLowerCase();
  const painLevel = Number(patientContext?.latestPainLevel || 0);

  if (painLevel >= 8 || text.includes("severe") || text.includes("high pain")) {
    return "I see that your pain may be high. Please follow the clinic emergency guidance and contact the medical staff if the pain continues, worsens, or feels unusual.";
  }

  if (text.includes("burning")) {
    return "Burning pain can be important to track. Try to note when it appears, what triggers it, and whether it changes after rest or medication. Continue documenting it in your daily pain report.";
  }

  if (text.includes("stabbing")) {
    return "Stabbing pain should be tracked carefully. Please document its location, duration, pain level, and whether it is new or unusual. If it becomes severe or unusual, contact the clinic staff.";
  }

  if (text.includes("medication") || text.includes("medicine")) {
    return "Please follow your prescribed medication plan. You can also use the Medication Reminder section to track dose, time, and whether the medication was taken.";
  }

  if (text.includes("trend") || text.includes("history")) {
    return "You can review your pain history in the Pain Trends section. Daily reports help the medical staff understand whether the pain is improving, stable, or worsening.";
  }

  return "Thank you for sharing. Please continue documenting your pain level, location, type, duration, and medication use. This information helps the medical staff follow your condition.";
}

async function callGemini(message, patientContext) {
  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

  const systemPrompt = `
You are PainCare Assistant, a supportive chatbot for a pain clinic web application.

Your role:
- Help patients document and understand their pain reports.
- Give general self-guidance about pain tracking, relaxation, medication reminders, and contacting medical staff when needed.
- Do not diagnose medical conditions.
- Do not replace a doctor.
- Do not suggest medication changes.
- If pain level is 8 or higher, or the user describes severe, unusual, or worsening pain, advise them to contact medical staff and follow clinic emergency guidance.
- Keep answers short, clear, and safe.
- Use simple English.
- Do not use Markdown formatting.
- Do not use bold text, asterisks, headings, bullet points, or numbered lists.
- Write the answer as short plain-text sentences.

Patient context:
${JSON.stringify(patientContext || {}, null, 2)}

User message:
${message}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 220,
        }
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data?.error?.message || "Gemini API request failed";
    throw new Error(errorMessage);
  }

  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I could not generate a response right now.";

  return reply;
}

router.post("/message", async (req, res) => {
  try {
    const { message, patientContext } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        reply: getFallbackResponse(message, patientContext),
        source: "fallback",
      });
    }

    const reply = await callGemini(message, patientContext);

    res.json({
      success: true,
      reply,
      source: "gemini",
    });
  } catch (error) {
    console.log("Chatbot error:", error.message);

    res.json({
      success: true,
      reply: getFallbackResponse(req.body.message || "", req.body.patientContext),
      source: "fallback",
    });
  }
});

module.exports = router;