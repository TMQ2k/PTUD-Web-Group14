import React from 'react';
import PropTypes from 'prop-types'; 
import { formatNumberToCurrency } from '../../utils/NumberHandler';

const AutoBidDialog = ({
  isOpen,
  onClose,
  onConfirm,
  price, // Changed from buyNowPrice
  productId
}) => {
  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    await onConfirm(productId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >     
      <div
        className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >        
        {/* HEADER: Changed to Orange/Red Gradient */}
        <div className="flex items-center justify-between bg-linear-to-br from-orange-400 to-red-500 p-4 text-white">
          <h3 className="text-lg font-bold leading-6">
            Xác nhận đấu giá
          </h3>
          
          <button
            type="button"
            className="rounded-md p-1 hover:bg-white/20 focus:outline-none"
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
          <div className="mt-2">
            {/* Updated Text Content */}
            <p className="text-sm text-gray-600 text-center">
              Bạn có muốn đấu giá với số tiền tối đa?
            </p>

            {/* Price Display */}
            <div className="mt-5 flex flex-col items-center justify-center rounded-lg bg-orange-50 p-4 border border-orange-100">
              <span className="text-xs font-semibold uppercase text-orange-500 tracking-wider">
                Giá đấu dự kiến
              </span>
              <span className="text-3xl font-extrabold text-orange-600 mt-1">
                {formatNumberToCurrency(price)} đ
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent 
                       bg-gradient-to-r from-orange-500 to-red-600 
                       px-4 py-2 text-base font-medium text-white shadow-sm 
                       hover:from-orange-600 hover:to-red-700 
                       focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                       sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
            onClick={handleConfirmClick}
          >
            Xác nhận
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
  // productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AutoBidDialog;