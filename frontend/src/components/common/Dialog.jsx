import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const Dialog = ({ isOpen, onClose, title, children }) => {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay / Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h3 className="text-lg font-bold leading-6 text-gray-900">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Dialog;