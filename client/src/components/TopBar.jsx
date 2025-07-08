import { FaShareAlt, FaEllipsisV, FaBars } from "react-icons/fa";

function TopBar({ onToggleSidebar }) {
    return (
        <div className="bg-[#343541] border-b border-gray-700 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <FaBars
                    className="text-white text-xl cursor-pointer lg:hidden"
                    onClick={onToggleSidebar}
                />
                <h1 className="text-white font-semibold text-lg hidden sm:block">
                    CHAT-BOT
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <FaShareAlt className="text-gray-300 hover:text-white cursor-pointer" />
                <FaEllipsisV className="text-gray-300 hover:text-white cursor-pointer" />
                <img
                    src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
                    alt="user"
                    className="w-8 h-8 rounded-full border border-gray-500"
                />
            </div>
        </div>
    );
}

export default TopBar;
