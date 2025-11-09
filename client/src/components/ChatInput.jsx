import { useState } from "react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="bg-[#40414F] p-3 shadow-inner">
      <div className="max-w-3xl mx-auto flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-md bg-[#343541] text-white border border-gray-600 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-[#10A37F] px-4 py-2 rounded-md hover:opacity-90"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
