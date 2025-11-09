import { useEffect, useRef } from "react";

function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">
        Hello buddy 👋, how can I help you today?
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col px-4 py-4 sm:px-6 sm:py-6 space-y-4">
      {messages.map((msg, i) =>
        msg.content === "<typing>" ? (
          <div key={i} className="flex items-center space-x-1 pl-4">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
          </div>
        ) : (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-3 rounded-lg break-words ${
              msg.role === "user"
                ? "bg-[#10A37F] text-white self-end ml-auto"
                : "bg-[#40414F] text-[#E2E8F0] self-start mr-auto"
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
