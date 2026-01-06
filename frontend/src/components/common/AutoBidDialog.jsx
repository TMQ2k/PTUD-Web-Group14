import React, { useState } from "react"; // 1. Import useState
import PropTypes from "prop-types";
import { formatNumberToCurrency } from "../../utils/NumberHandler";

const AutoBidDialog = ({ isOpen, onClose, onConfirm, price, productId }) => {
  // 2. Local state to track loading status
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    // Prevent double clicks
    if (isProcessing) return;

    try {
      setIsProcessing(true); // Start loading
      setError(null);
      await onConfirm(productId, price);
      // Only close if successful.
      // If onConfirm throws an error, the catch block (if added) or finally block handles it.
      onClose();
    } catch (error) {
      setError(error);
      console.error("Error during auto bid:", error);
    } finally {
      // Reset state (useful if the parent component keeps this dialog mounted)
      setIsProcessing(false);
    }
  };

  // Helper to handle backdrop click (prevent closing while processing)
  const handleBackdropClick = (e) => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 transition-opacity"
      onClick={handleBackdropClick} // Use safe handler
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between bg-linear-to-br from-orange-400 to-red-500 p-4 text-white">
          <h3 className="text-lg font-bold leading-6">Xác nhận đấu giá</h3>

          <button
            type="button"
            disabled={isProcessing} // 3. Disable Close Button
            className="rounded-md p-1 hover:bg-white/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6">
          <div className="mt-2">
            <p className="text-sm text-gray-600 text-center">
              Bạn có muốn đấu giá với số tiền tối đa?
            </p>

            {/* Price Display */}
            <div className="mt-5 flex flex-col items-center justify-center rounded-lg bg-orange-50 p-4 border border-orange-100">
              <span className="text-xs font-semibold uppercase text-orange-500 tracking-wider">
                Mức giá tối đa của bạn
              </span>
              <span className="text-3xl font-extrabold text-orange-600 mt-1">
                {formatNumberToCurrency(price)} đ
              </span>
            </div>
          </div>
        </div>
        {error && 
          <div className="text-red-500 bg-red-100 rounded-lg w-[80%] px-2 py-1 mx-auto text-center text-base">
            {error?.message ? `Error: ${error.message}` : "Hệ thống không thể gửi đấu giá cho bạn!"}
          </div>
        }
        {/* FOOTER ACTIONS */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
          <button
            type="button"
            disabled={isProcessing} // 4. Disable Confirm Button
            className={`inline-flex w-full justify-center rounded-md border border-transparent 
                        px-4 py-2 text-base font-medium text-white shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                        sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200
                        ${
                          isProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        }`}
            onClick={handleConfirmClick}
          >
            {/* 5. Conditional Text and Spinner */}
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Xác nhận"
            )}
          </button>

          <button
            type="button"
            disabled={isProcessing} // 6. Disable Cancel Button
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
          >
            Huỷ bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

AutoBidDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  price: PropTypes.number.isRequired,
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AutoBidDialog;
