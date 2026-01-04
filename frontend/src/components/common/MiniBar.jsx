import { Link } from "react-router-dom";
import { useState } from "react";
import { IoMenu, IoClose, IoHome, IoPerson } from "react-icons/io5";

const MiniBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { 
      id: 1, 
      label: "Trang chủ", 
      icon: <IoHome className="size-5" />, 
      to: "/", 
      color: "bg-blue-500" 
    },    
    { 
      id: 2, 
      label: "Tài khoản", 
      icon: <IoPerson className="size-5" />, 
      to: "/profile", 
      color: "bg-pink-500" 
    },
  ];

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end">
      
      {/* --- EXPANDABLE MENU ITEMS --- */}
      {/* FIX: Added 'z-50' here so these items sit ON TOP of the backdrop (which is z-40) */}
      <div className={`absolute bottom-full right-0 mb-4 z-50 flex flex-col items-end gap-3 transition-all duration-300 ease-out origin-bottom ${
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-0 translate-y-10 pointer-events-none"
        }`}>
        
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            className="group flex items-center justify-end gap-3"
            onClick={() => setIsOpen(false)}
          >
            {/* Label (Tooltip) */}
            <span className="px-3 py-1 bg-white text-gray-700 text-sm font-semibold rounded-lg shadow-md opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap">
              {action.label}
            </span>

            {/* Action Button */}
            <div className={`size-10 rounded-full shadow-lg text-white flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-200 ${action.color}`}>
              {action.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* --- MAIN TRIGGER BUTTON --- */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`size-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border-4 border-white/20 backdrop-blur-sm relative z-50
          ${isOpen ? "bg-red-500 rotate-90" : "bg-linear-to-br from-blue-500 to-purple-600 rotate-0"}
          hover:scale-105 active:scale-95`}
      >
        {isOpen ? (
          <IoClose className="size-7 text-white" />
        ) : (
          <IoMenu className="size-7 text-white" />
        )}
      </button>

      {/* Backdrop */}
      {/* This is z-40. The menu items above must be > z-40 to be clickable */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MiniBar;