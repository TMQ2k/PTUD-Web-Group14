import React, { useState } from 'react';

const CheckoutFilterBar = ({ mainColor, onFilter }) => {
  // We keep track of the active filter in a state
  const [activeFilter, setActiveFilter] = useState("Tất cả"); 

  const optionsMap = new Map([
    ["Tất cả", null],
    ["Chưa có ảnh giao dịch", "invalid"],
    ["Đang chờ xử lý", "sent"],    
    ["Đang chờ vận chuyển", "paid"],
    ["Huỷ giao dịch", "cancelled"],
    ["Đã nhận hàng", "received"],
  ]);

  const keys = Array.from(optionsMap.keys());

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);   
    const filterValue = optionsMap.get(filter);
    onFilter(filterValue);
  };

  return (
    <div className="w-full mb-6">
      {/* Scrollable container for mobile responsiveness, or flex-wrap for desktop */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {keys.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
              ${
                activeFilter === filter
                  ? `bg-${mainColor}-600 text-white border-${mainColor}-600 shadow-md` // Active State (Matches your Confirm button)
                  : `bg-white text-gray-600 border-gray-200 hover:bg-${mainColor}-50 hover:text-${mainColor}-600 hover:border-${mainColor}-200` // Inactive State
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CheckoutFilterBar;