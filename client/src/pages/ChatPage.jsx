import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("https://real-chatbot.onrender.com/api/chat");
        const data = await res.json();

        if (res.ok) {
          setChatSessions(data);
          if (data.length > 0) {
            setMessages(data[0].messages);
            setCurrentChatId(data[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load chats:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: message }];
    setMessages([
      ...updatedMessages,
      { role: "bot", content: "<typing>" }
    ]);

    try {
      const res = await fetch("https://real-chatbot.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, chatId: currentChatId }),
      });

      const data = await res.json();

      if (res.ok) {
        const botReply = { role: "bot", content: data.reply };

        const finalMessages = [...updatedMessages, botReply];
        setMessages(finalMessages);

        if (currentChatId) {
          const updatedSessions = chatSessions.map((session) =>
            session._id === currentChatId
              ? { ...session, messages: finalMessages }
              : session
          );
          setChatSessions(updatedSessions);
        } else if (data.chat && data.chat._id) {
          setChatSessions((prev) => [...prev, data.chat]);
          setCurrentChatId(data.chat._id);
        } else {
          console.warn("⚠️ No valid chat returned from backend.");
        }
      } else {
        setMessages([...updatedMessages, {
          role: "bot",
          content: "⚠️ Failed to fetch response."
        }]);
      }
    } catch (err) {
      console.error("Frontend error:", err.message);
      setMessages([...updatedMessages, {
        role: "bot",
        content: "⚠️ Something went wrong!"
      }]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setSidebarOpen(false);
  };

  const handleSelectChat = (id) => {
    const session = chatSessions.find((c) => c._id === id);
    setMessages(session.messages);
    setCurrentChatId(id);
    setSidebarOpen(false);
  };

  const handleDeleteChat = async () => {
    if (!currentChatId) return;

    try {
      const res = await fetch(
        `https://real-chatbot.onrender.com/api/chat/${currentChatId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        const updatedSessions = chatSessions.filter(
          (c) => c._id !== currentChatId
        );
        setChatSessions(updatedSessions);
        setMessages([]);
        setCurrentChatId(null);
      }
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#343541] text-white">
        <p>⏳ Loading your chats...</p>
      </div>
    );
  }

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
          messages={messages}
        />
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default ChatPage;