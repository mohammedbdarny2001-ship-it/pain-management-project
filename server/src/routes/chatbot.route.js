const express = require("express");
const PainReport = require("../models/PainReport");

const router = express.Router();

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function classifyPainLevel(painLevel) {
  const level = Number(painLevel);

  if (!Number.isFinite(level)) {
    return {
      label: "Unknown",
      severity: "Unknown",
      description: "There is no recent pain level available.",
    };
  }

  if (level <= 3) {
    return {
      label: "Mild pain",
      severity: "Low",
      description: "Your pain level is currently low.",
    };
  }

  if (level <= 6) {
    return {
      label: "Moderate pain",
      severity: "Medium",
      description: "Your pain level is noticeable and should be monitored.",
    };
  }

  if (level <= 8) {
    return {
      label: "High pain",
      severity: "High",
      description:
        "Your pain level is high. Closer follow-up is recommended.",
    };
  }

  return {
    label: "Very high pain",
    severity: "Very High",
    description:
      "Your pain level is very high. You should contact the clinic staff or follow emergency guidance.",
  };
}

function getPainTypeGuidance(painType, painLevel, medicationTaken) {
  const type = normalizeText(painType);
  const level = Number(painLevel);
  const tookMedication = normalizeText(medicationTaken) === "yes";

  if (level >= 8) {
    return "Because the pain level is high, contact the medical staff if the pain continues, worsens, feels unusual, or does not improve.";
  }

  if (type === "burning") {
    return "Burning pain should be tracked carefully. Note when it appears, what triggers it, and whether rest or medication changes it.";
  }

  if (type === "pressing") {
    return "Pressing pain can be affected by posture, movement, or physical effort. Rest in a comfortable position and document when it increases.";
  }

  if (type === "stabbing" || type === "sharp") {
    return "Sharp or stabbing pain should be monitored closely. Avoid sudden movements and contact the clinic if it is new, severe, or worsening.";
  }

  if (type === "dull") {
    return "Dull pain is useful to follow over time. Gentle movement, rest, and consistent daily reports can help the clinic understand the trend.";
  }

  if (!tookMedication && level >= 6) {
    return "You reported elevated pain and did not take medication. Follow your prescribed medication plan if relevant, without changing doses by yourself.";
  }

  return "Continue documenting pain level, location, pain type, duration, medication use, and any triggers.";
}

function getGeneralStatus(classification, patientContext) {
  const painLevel = Number(patientContext?.latestPainLevel);
  const medicationTaken = normalizeText(patientContext?.medicationTaken);

  if (!Number.isFinite(painLevel)) {
    return "There is not enough recent information to estimate your status.";
  }

  if (painLevel >= 8) {
    return "Your current status looks urgent for follow-up because the reported pain level is high.";
  }

  if (painLevel >= 6 && medicationTaken === "no") {
    return "Your current status suggests that follow-up may be needed, especially because the pain is elevated and medication was not taken.";
  }

  if (painLevel >= 4) {
    return "Your current status looks moderate. It is not an emergency based only on this report, but it should be monitored.";
  }

  return "Your current status looks stable based on the latest pain report.";
}

async function buildPainStatistics(patientContext) {
  const painType = patientContext?.latestPainType;

  if (!painType) {
    return {
      hasData: false,
      message: "No pain type was found in the latest report.",
    };
  }

  const allReports = await PainReport.find({}, "patientUsername painType painLevel");

  if (!allReports.length) {
    return {
      hasData: false,
      message: "There are no pain reports in the system yet.",
    };
  }

  const normalizedPainType = normalizeText(painType);

  const allPatientsWithReports = new Set(
    allReports.map((report) => report.patientUsername)
  );

  const patientsWithSamePainType = new Set(
    allReports
      .filter((report) => normalizeText(report.painType) === normalizedPainType)
      .map((report) => report.patientUsername)
  );

  const samePainTypeReports = allReports.filter((report) => {
    return normalizeText(report.painType) === normalizedPainType;
  });

  const severeSameTypeReports = samePainTypeReports.filter((report) => {
    return Number(report.painLevel) >= 7;
  });

  const totalPatients = allPatientsWithReports.size;
  const sameTypePatients = patientsWithSamePainType.size;

  const patientPercentage =
    totalPatients === 0 ? 0 : Math.round((sameTypePatients / totalPatients) * 100);

  const severePercentage =
    samePainTypeReports.length === 0
      ? 0
      : Math.round((severeSameTypeReports.length / samePainTypeReports.length) * 100);

  return {
    hasData: true,
    painType,
    totalPatients,
    sameTypePatients,
    patientPercentage,
    totalReports: allReports.length,
    samePainTypeReports: samePainTypeReports.length,
    severeSameTypeReports: severeSameTypeReports.length,
    severePercentage,
  };
}

function buildClassificationResponse(patientContext, painStatistics) {
  const painLevel = patientContext?.latestPainLevel;
  const painType = patientContext?.latestPainType;
  const medicationTaken = patientContext?.medicationTaken;

  if (painLevel === null || painLevel === undefined || !painType) {
    return (
      "I need a recent pain report first.\n" +
      "Please submit your pain level, type, location, duration, and medication use."
    );
  }

  const classification = classifyPainLevel(painLevel);
  const guidance = getPainTypeGuidance(painType, painLevel, medicationTaken);

  let comparisonText = "Not enough clinic data for comparison yet.";

  if (painStatistics?.hasData) {
    comparisonText =
      `${painStatistics.patientPercentage}% of patients reported ${painStatistics.painType} pain. ` +
      `${painStatistics.severePercentage}% of these reports were severe.`;
  }

  return (
    `Classification: ${painType} pain, ${classification.label}.\n` +
    `Severity: ${painLevel}/10 (${classification.severity}).\n` +
    `Status: ${classification.description}\n` +
    `Guidance: ${guidance}\n` +
    `Clinic comparison: ${comparisonText}`
  );
}

function shouldClassifyPain(message) {
  const text = normalizeText(message);

  return (
    text.includes("classify") ||
    text.includes("classification") ||
    text.includes("assess") ||
    text.includes("status") ||
    text.includes("my condition") ||
    text.includes("pain category") ||
    text.includes("what is my situation") ||
    text.includes("high pain") ||
    text.includes("burning") ||
    text.includes("stabbing") ||
    text.includes("sharp") ||
    text.includes("pressing") ||
    text.includes("dull")
  );
}

function getFallbackResponse(message, patientContext, painStatistics) {
  const text = normalizeText(message);
  const painLevel = Number(patientContext?.latestPainLevel || 0);

  if (shouldClassifyPain(message)) {
    return buildClassificationResponse(patientContext, painStatistics);
  }

  if (painLevel >= 8 || text.includes("severe") || text.includes("high pain")) {
    return buildClassificationResponse(patientContext, painStatistics);
  }

  if (text.includes("medication") || text.includes("medicine")) {
    return (
      "Please follow your prescribed medication plan.\n\n" +
      "You can also use the Medication Reminder section to track dose, time, and whether the medication was taken.\n\n" +
      "Do not change medication or dosage without the clinic staff."
    );
  }

  if (text.includes("trend") || text.includes("history")) {
    return (
      "You can review your pain history in the Pain Trends section.\n\n" +
      "Daily reports help the medical staff understand whether the pain is improving, stable, or worsening."
    );
  }

  return buildClassificationResponse(patientContext, painStatistics);
}

async function callGemini(message, patientContext, painStatistics) {
  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

  const systemPrompt = `
You are PainCare Assistant, a supportive chatbot for a pain clinic web application.

Your role:
- Help the patient classify their pain based on the latest pain report.
- Explain the patient's general status in simple and safe language.
- Give general safe guidance only.
- Compare the patient's pain type with clinic data using the provided statistics.
- Do not diagnose medical conditions.
- Do not replace a doctor.
- Do not suggest medication changes.
- If pain level is 8 or higher, or the user describes severe, unusual, or worsening pain, advise them to contact medical staff and follow clinic emergency guidance.
- Keep the answer very short.
- Maximum 8 lines.
- Each line must be one short sentence.
- Do not write long paragraphs.
- Do not repeat unnecessary details.
- Use this exact structure:
Classification:
Severity:
Status:
Guidance:
Clinic comparison:
- Use simple English.
- Use this structure:
Pain classification:
Severity:
General status:
Recommended guidance:
Comparison with clinic data:
Important:

Patient context:
${JSON.stringify(patientContext || {}, null, 2)}

Clinic comparison statistics:
${JSON.stringify(painStatistics || {}, null, 2)}

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
          temperature: 0.3,
          maxOutputTokens: 300,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || "Gemini API request failed";
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

    const painStatistics = await buildPainStatistics(patientContext);

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        reply: getFallbackResponse(message, patientContext, painStatistics),
        source: "fallback",
      });
    }

    const reply = await callGemini(message, patientContext, painStatistics);

    res.json({
      success: true,
      reply,
      source: "gemini",
    });
  } catch (error) {
    console.log("Chatbot error:", error.message);

    try {
      const painStatistics = await buildPainStatistics(req.body.patientContext);

      return res.json({
        success: true,
        reply: getFallbackResponse(
          req.body.message || "",
          req.body.patientContext,
          painStatistics
        ),
        source: "fallback",
      });
    } catch (fallbackError) {
      return res.json({
        success: true,
        reply:
          "I can help classify your pain, but I could not read the clinic data right now. Please try again later or contact the clinic staff if your pain is severe.",
        source: "fallback",
      });
    }
  }
});

module.exports = router;