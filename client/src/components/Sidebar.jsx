function Sidebar({ onNewChat, onSelectChat, chatSessions, isOpen, onClose }) {
  return (
    <div
      className={`
        fixed lg:static top-0 left-0 h-full w-64 bg-[#202123] text-[#E5E7EB]
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        z-40 flex flex-col justify-between
      `}
    >
      <div>
        {/* New Chat Button + Close Button */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <button
            onClick={onNewChat}
            className="w-full bg-[#40414F] hover:bg-[#4b4c5a] p-2 rounded text-left"
          >
            ➕ New Chat
          </button>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 ml-2 hover:text-white"
          >
            ✖️
          </button>
        </div>

        {/* Chat List Section */}
        <div className="p-4 overflow-y-auto">
          <h2 className="text-sm text-gray-400 mb-2">Recent Chats</h2>

          {chatSessions.length === 0 ? (
            <p className="text-gray-500 text-sm">No chats yet.</p>
          ) : (
            <ul className="space-y-2">
              {chatSessions.map((chat, index) => (
                <li key={index}>
                  <button
                    onClick={() => onSelectChat(index)}
                    className="w-full text-left p-2 bg-[#2A2B32] hover:bg-[#3a3b45] rounded text-sm truncate"
                  >
                    🗨️ {chat.title || "Untitled Chat"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;