function QuickReplyButtons({ replies, onReply }) {
  return (
    <div className="flex flex-wrap gap-3">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onReply(reply)}
          className={
            reply === "Pain is severe"
              ? "bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-200"
              : "bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
          }
        >
          {reply}
        </button>
      ))}
    </div>
  );
}

export default QuickReplyButtons;