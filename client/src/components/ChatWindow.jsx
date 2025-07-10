import { useEffect, useRef } from "react";

function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, index) =>
        msg.content === "<typing>" ? (
          <div key={index} className="flex justify-start items-center pl-2">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
          </div>
        ) : (
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
        )
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;