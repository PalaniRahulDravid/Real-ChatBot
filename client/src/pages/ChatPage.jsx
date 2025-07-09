import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: message }];
    setMessages(updatedMessages);

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
        const finalMessages = [...updatedMessages, { role: "bot", content: data.reply }];
        setMessages(finalMessages);

        const title = finalMessages[0]?.content.slice(0, 20) || "New Chat";

        if (currentChatIndex !== null) {
          // Update current chat
          const updatedSessions = [...chatSessions];
          updatedSessions[currentChatIndex] = { title, messages: finalMessages };
          setChatSessions(updatedSessions);
        } else {
          // Create new chat
          const newIndex = chatSessions.length;
          setChatSessions((prev) => [...prev, { title, messages: finalMessages }]);
          setCurrentChatIndex(newIndex);
        }
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
    setCurrentChatIndex(null);
    setSidebarOpen(false);
  };

  const handleSelectChat = (index) => {
    const session = chatSessions[index];
    setMessages(session.messages);
    setCurrentChatIndex(index);
    setSidebarOpen(false);
  };

  const handleDeleteChat = () => {
    if (currentChatIndex !== null) {
      const updatedSessions = [...chatSessions];
      updatedSessions.splice(currentChatIndex, 1);
      setChatSessions(updatedSessions);

      // Reset state
      setMessages([]);
      setCurrentChatIndex(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        chatSessions={chatSessions}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 bg-[#343541] text-white">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(true)}
          onDeleteChat={handleDeleteChat}
        />
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default ChatPage;