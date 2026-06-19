function ChatMessage({ message }) {
  const isPatient = message.role === "patient";

  return (
    <div
      className={
        isPatient
          ? "flex justify-end"
          : "flex justify-start"
      }
    >
      <div
        className={
          isPatient
            ? "bg-blue-600 text-white rounded-xl p-3 max-w-md"
            : "bg-white border rounded-xl p-3 max-w-md shadow-sm"
        }
      >
        <p className="text-xs mb-1 opacity-70">
          {isPatient ? "Patient" : "Assistant"}
        </p>

        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}

export default ChatMessage;