import { useState, useRef, useEffect } from "react";
import { FaShareAlt, FaEllipsisV, FaBars } from "react-icons/fa";

function TopBar({ onToggleSidebar, onDeleteChat, messages = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleDeleteClick = () => {
    onDeleteChat();
    setMenuOpen(false);
  };

  const handleShareClick = async () => {
    const chatText =
      messages
        .map((msg) => `${msg.role === "user" ? "You" : "Bot"}: ${msg.content}`)
        .join("\n\n") || "No messages to share.";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Chat from ChatBot 🤖",
          text: chatText,
        });
      } catch (err) {
        alert("❌ Sharing was cancelled or failed.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(chatText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert("❌ Failed to copy chat.");
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#343541] border-b border-gray-700 px-6 py-4 flex justify-between items-center relative">
      <div className="flex items-center gap-3">
        <FaBars
          className="text-white text-xl cursor-pointer lg:hidden"
          onClick={onToggleSidebar}
        />
        <h1 className="text-white font-semibold text-lg hidden sm:block">
          CHAT-BOT
        </h1>
      </div>

      <div className="flex items-center gap-4 relative" ref={menuRef}>
        {/* Share Icon */}
        <FaShareAlt
          className="text-gray-300 hover:text-white cursor-pointer"
          onClick={handleShareClick}
          title="Share or Copy Chat"
        />

        {/* Menu Button */}
        <div className="relative">
          <FaEllipsisV
            className="text-gray-300 hover:text-white cursor-pointer"
            onClick={toggleMenu}
          />

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#202123] text-white rounded shadow-lg z-50">
              <button
                onClick={handleDeleteClick}
                className="block w-full text-left px-4 py-2 hover:bg-[#2A2B32]"
              >
                🗑️ Delete Chat
              </button>
            </div>
          )}
        </div>

        {/* User Image */}
        <img
          src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
          alt="user"
          className="w-8 h-8 rounded-full border border-gray-500"
        />

        {/* Success Toast */}
        {copied && (
          <div className="absolute top-full mt-2 right-0 bg-green-600 text-white px-3 py-1 text-sm rounded shadow z-50">
            ✅ Chat copied!
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;