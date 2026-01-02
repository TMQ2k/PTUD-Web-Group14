import React from 'react';
import PropTypes from 'prop-types'; // Recommended for prop validation
import { formatNumberToCurrency } from '../../utils/NumberHandler';

const BuyNowDialog = ({
  isOpen,
  onClose,
  onConfirm,
  buyNowPrice,
  productId
}) => {
  // 1. Don't render anything if the dialog isn't open
  if (!isOpen) return null;

  // Helper to format the price nicely (assuming USD for this example)
  // const formattedPrice = new Intl.NumberFormat('en-US', {
  //   style: 'currency',
  //   currency: 'USD',
  // }).format(buyNowPrice);

  const handleConfirmClick = () => {
    // Trigger the purchase action with the ID
    onConfirm(productId);
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
        <div className="flex items-center justify-between bg-linear-to-br from-blue-400 to-purple-600 p-4 text-white">
          <h3 className="text-lg font-bold leading-6">
            Xác nhận mua ngay
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
            <p className="text-sm text-gray-600">
              Bạn chắc chắn mua ngay sản phẩm?
            </p>

            {/* Price Display */}
            <div className="mt-5 flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 border border-gray-100">
              <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Giá mua ngay</span>
              <span className="text-3xl font-extrabold text-gray-900 mt-1">
                {formatNumberToCurrency(buyNowPrice)} đ
              </span>
            </div>
            {/* Helpful ID display for debugging/confirmation */}
            {/* <p className="text-xs text-center text-gray-400 mt-2">: {productId}</p> */}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-linear-to-r from-blue-500 to-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleConfirmClick}
          >
            Buy Now
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Adding prop types for better development experience
BuyNowDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  buyNowPrice: PropTypes.number.isRequired,
  //productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default BuyNowDialog;