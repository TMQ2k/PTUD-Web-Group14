import React from "react";
import { Unlock, ShieldX } from "lucide-react";

const BidderBannedList = ({ bannedList, handleUnban }) => {
  if (!bannedList || bannedList.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
        <ShieldX size={40} className="opacity-20" />
        <span className="text-sm">Chưa có ai bị chặn</span>
      </div>
    );
  }

  return (
    <ul className="h-full overflow-y-auto p-3 space-y-2 custom-scrollbar">
      {bannedList.map((b) => (
        <li
          key={b.user_id}
          className="bg-white p-3 rounded-lg border-l-4 border-l-red-500 border-y border-r border-gray-100 shadow-sm flex justify-between items-center group"
        >
          <span className="font-medium text-sm text-gray-700 truncate pr-2">
            {b.username}
          </span>
          
          <button
            className="p-2 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all"
            onClick={() => handleUnban(b.user_id)}
            title="Huỷ cấm (Unban)"
          >
            <Unlock size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default BidderBannedList;