import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "⚠️ Failed to fetch response." },
        ]);
      }
    } catch (err) {
      console.error("Frontend error:", err.message);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Something went wrong!" },
      ]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 bg-[#343541] text-white">
        <TopBar onToggleSidebar={() => setSidebarOpen(true)} />
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default ChatPage;