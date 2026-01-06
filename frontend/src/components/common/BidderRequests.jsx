import React from "react";
import { Star, Check, User } from "lucide-react";

const BidderRequests = ({ requests, handleAcceptRequest }) => {
  if (!requests || requests.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
        <User size={40} className="opacity-20" />
        <span className="text-sm">Không có yêu cầu nào</span>
      </div>
    );
  }

  return (
    <ul className="h-full overflow-y-auto p-3 space-y-3 custom-scrollbar">
      {requests.map((r) => (
        <li
          key={r.bidder_id}
          className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-bold text-gray-800 text-sm">{r.bidder_username}</div>
              <div className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded mt-1 
                ${r.bidder_rating > 50 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                <Star size={10} fill="currentColor" />
                {r.bidder_rating} pts
              </div>
            </div>
            
            <button
              onClick={() => handleAcceptRequest(r.bidder_id)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-blue-200 shadow-sm"
              title="Chấp nhận"
            >
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
          
          <div className="bg-gray-50 rounded p-2 text-xs text-gray-600">
            <span className="font-semibold text-gray-500 block mb-0.5">Lý do:</span>
            {r.reason || "Không có lý do"}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BidderRequests;