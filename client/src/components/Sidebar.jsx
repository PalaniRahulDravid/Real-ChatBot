function Sidebar({ onNewChat, isOpen, onClose }) {
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
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <button
            onClick={onNewChat}
            className="w-full bg-[#40414F] hover:bg-[#4b4c5a] p-2 rounded text-left"
          >
            ➕ New Chat
          </button>

          {/* Close button (visible only on mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 ml-2 hover:text-white"
          >
            ✖️
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-sm text-gray-400 mb-2">Recent Chats</h2>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
