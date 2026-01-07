import React, { useState } from "react";
import { createPortal } from "react-dom"; // 1. Import createPortal
import PropTypes from "prop-types";
import { formatNumberToCurrency } from "../../utils/NumberHandler";

const AutoBidDialog = ({ isOpen, onClose, onConfirm, price, productId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      setError(null);
      await onConfirm(productId, price);
      onClose();
    } catch (error) {
      setError(error);
      console.error("Error during auto bid:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackdropClick = () => {
    if (!isProcessing) onClose();
  };

  // 2. Define the content to be teleported
  const modalHTML = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 transition-opacity"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between bg-gradient-to-br from-orange-400 to-red-500 p-4 text-white">
          <h3 className="text-lg font-bold leading-6">Xác nhận đấu giá</h3>
          <button
            type="button"
            disabled={isProcessing}
            className="rounded-md p-1 hover:bg-white/20 focus:outline-none disabled:opacity-50"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6">
          <p className="text-sm text-gray-600 text-center">Bạn có muốn đấu giá với số tiền tối đa?</p>
          <div className="mt-5 flex flex-col items-center justify-center rounded-lg bg-orange-50 p-4 border border-orange-100">
            <span className="text-xs font-semibold uppercase text-orange-500 tracking-wider">Mức giá tối đa của bạn</span>
            <span className="text-3xl font-extrabold text-orange-600 mt-1">{formatNumberToCurrency(price)} đ</span>
          </div>
        </div>

        {error && (
          <div className="text-red-500 bg-red-100 rounded-lg w-[85%] px-2 py-2 mx-auto text-center text-sm mb-4">
            {error?.message || "Hệ thống không thể gửi đấu giá cho bạn!"}
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
          <button
            type="button"
            disabled={isProcessing}
            className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 ${
              isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            }`}
            onClick={handleConfirmClick}
          >
            {isProcessing ? "Đang xử lý..." : "Xác nhận"}
          </button>
          <button
            type="button"
            disabled={isProcessing}
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            onClick={onClose}
          >
            Huỷ bỏ
          </button>
        </div>
      </div>
    </div>
  );

  // 3. Teleport to document.body
  return createPortal(modalHTML, document.body);
};

export default AutoBidDialog;