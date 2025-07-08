function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`max-w-2xl px-4 py-3 rounded-lg ${
            msg.role === "user"
              ? "bg-[#10A37F] text-white self-end ml-auto"
              : "bg-[#40414F] text-[#D1D5DB] self-start mr-auto"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
