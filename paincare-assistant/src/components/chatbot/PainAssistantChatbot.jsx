import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../../services/chatbotService";
import { getPainReportsByPatient } from "../../services/painReportService";
import { useUser } from "../../context/UserContext";
import ChatMessage from "./ChatMessage";
import QuickReplyButtons from "./QuickReplyButtons";

function PainAssistantChatbot() {
  const { currentUser: user } = useUser();
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello, I am PainCare Assistant. I can help classify your latest pain report, explain your general status, and compare your pain type with clinic data.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestReport, setLatestReport] = useState(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    async function loadLatestPainReport() {
      if (!user?.username) return;

      const result = await getPainReportsByPatient(user.username);

      if (result.success && result.reports && result.reports.length > 0) {
        setLatestReport(result.reports[0]);
      }
    }

    loadLatestPainReport();
  }, [user]);
  useEffect(() => {
  if (chatBoxRef.current) {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }
}, [messages, loading]);


  const buildPatientContext = () => {
    return {
      username: user?.username || "",
      name: user?.name || "",
      age: user?.age || "",
      diagnosis: user?.diagnosis || "",
      physician: user?.physician || "",
      latestPainLevel: latestReport?.painLevel ?? null,
      latestPainLocation: latestReport?.location || "",
      latestPainType: latestReport?.painType || "",
      latestPainDuration: latestReport?.duration || "",
      medicationTaken: latestReport?.medicationTaken || "",
    };
  };

  const handleSend = async (customMessage = null) => {
    const messageText = customMessage || input;

    if (!messageText.trim()) return;

    const userMessage = {
      sender: "user",
      text: messageText,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    const result = await sendChatMessage(messageText, buildPatientContext());

    const botMessage = {
      sender: "bot",
      text: result.reply,
      source: result.source,
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setLoading(false);
  };

  const quickMessages = [
    "Classify my pain and tell me my general status",
    "Compare my pain type with other patients",
    "What should I do based on my latest pain report?",
    "How can I track my medication?",
  ];

  return (
    <section
      id="chatbot-section"
      className="scroll-mt-32 bg-white rounded-2xl shadow-md p-6"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Pain Assistant Chatbot
        </h2>
        <p className="text-slate-500 mt-1">
          Ask the chatbot to classify your latest pain report, explain your general
          status, compare your pain type with clinic data, and suggest safe next steps.
        </p>
      </div>

      {latestReport && (
        <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
          Latest pain report: pain level {latestReport.painLevel}/10, location:{" "}
          {latestReport.location}, type: {latestReport.painType}
        </div>
      )}

      <div ref={chatBoxRef} className="h-80 overflow-y-auto overscroll-contain border rounded-xl p-4 bg-slate-50 space-y-3">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl px-4 py-2 text-sm text-slate-500">
              PainCare Assistant is typing...
            </div>
          </div>
        )}
        
      </div>

      <QuickReplyButtons
        replies={quickMessages}
        onReply={handleSend}
        disabled={loading}
      />

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Write your message..."
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl disabled:bg-slate-400"
        >
          Send
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-3">
        This chatbot provides general guidance only and does not replace medical
        advice from the clinic staff.
      </p>
    </section>
  );
}

export default PainAssistantChatbot;