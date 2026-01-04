import { useState } from "react";
import { Search, Ban, UserX } from "lucide-react";

const BidderSearching = ({ searchList, handleSearch, handleBan }) => {
  const [searchTarget, setSearchTarget] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTarget);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-100">
        <form onSubmit={onSubmit} className="relative">
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Nhập tên người dùng..."
            value={searchTarget}
            onChange={(e) => setSearchTarget(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </form>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {!searchList || searchList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Search size={40} className="opacity-20" />
            <span className="text-sm">Tìm kiếm người dùng để chặn</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {searchList.map((b) => (
              <li 
                key={b.user_id} 
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-red-50 border border-transparent hover:border-red-100 group transition-all"
              >
                <div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-700">{b.username}</span>
                    <span className="text-xs text-gray-400">{b.email || `ID: ${b.user_id}`}</span>
                </div>
                
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-red-200 text-red-600 text-xs font-semibold 
                             group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm"
                  onClick={() => handleBan(b.user_id)}
                >
                  <Ban size={12} />
                  Cấm
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BidderSearching;