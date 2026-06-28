function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white text-slate-700 border"
        }`}
      >
        <p className="whitespace-pre-line leading-relaxed">{message.text}</p>

        {!isUser && message.source && (
          <p className="text-xs text-slate-400 mt-2">
            Source: {message.source}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;