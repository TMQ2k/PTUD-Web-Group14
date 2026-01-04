import React, { useState } from 'react'; // 1. Import useState
import PropTypes from 'prop-types'; 
import { formatNumberToCurrency } from '../../utils/NumberHandler';

const BuyNowDialog = ({
  isOpen,
  onClose,
  onConfirm,
  buyNowPrice,
  productId
}) => {
  // 2. Local state to track loading status
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Don't render anything if the dialog isn't open
  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    // Prevent double clicks
    if (isProcessing) return;

    try {
      setIsProcessing(true); // Start loading
      // Trigger the purchase action with the ID
      await onConfirm(productId);
      onClose();
    } catch (error) {
      console.error("Error during buy now:", error);
    } finally {
      setIsProcessing(false); // Reset state
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
        <div className="flex items-center justify-between bg-linear-to-br from-blue-400 to-purple-600 p-4 text-white">
          <h3 className="text-lg font-bold leading-6">
            Xác nhận mua ngay
          </h3>
          
          <button
            type="button"
            disabled={isProcessing} // 3. Disable Close Button
            className="rounded-md p-1 hover:bg-white/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
          <button
            type="button"
            disabled={isProcessing} // 4. Disable Confirm Button
            className={`inline-flex w-full justify-center rounded-md border border-transparent 
                        px-4 py-2 text-base font-medium text-white shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                        sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200
                        ${isProcessing 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                        }`}
            onClick={handleConfirmClick}
          >
            {/* 5. Conditional Text and Spinner */}
            {isProcessing ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Đang xử lý...
               </span>
            ) : (
              "Buy Now"
            )}
          </button>
          
          <button
            type="button"
            disabled={isProcessing} // 6. Disable Cancel Button
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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