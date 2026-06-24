function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white text-slate-700 border"
        }`}
      >
        <p>{message.text}</p>

        {!isUser && message.source && (
          <p className="text-xs text-slate-400 mt-1">
            Source: {message.source}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
