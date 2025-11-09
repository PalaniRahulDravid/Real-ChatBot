import { useEffect } from "react";

function Sidebar({
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  chatSessions,
  currentChatId,
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#202123] text-[#E5E7EB] 
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 z-40 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={onNewChat}
            className="w-full bg-[#40414F] hover:bg-[#4b4c5a] p-2 rounded"
          >
            ➕ New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h2 className="text-sm text-gray-400 mb-2">Recent Chats</h2>
          {chatSessions.length === 0 ? (
            <p className="text-gray-500 text-sm">No chats yet.</p>
          ) : (
            chatSessions.map((chat) => (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`cursor-pointer px-3 py-2 rounded ${
                  currentChatId === chat._id
                    ? "bg-[#10A37F] text-white"
                    : "hover:bg-[#2A2B32]"
                } truncate`}
              >
                🗨️ {chat.title}
              </div>
            ))
          )}
        </div>

        <div className="p-3 text-center text-gray-500 text-xs border-t border-gray-700">
          Developed by <span className="text-white">RAHUL DRAVID</span>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
