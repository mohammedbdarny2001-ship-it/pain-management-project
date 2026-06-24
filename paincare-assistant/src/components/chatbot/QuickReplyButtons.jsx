function QuickReplyButtons({ replies, onReply, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onReply(reply)}
          disabled={disabled}
          className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-full"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}

export default QuickReplyButtons;
