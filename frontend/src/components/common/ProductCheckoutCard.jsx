import React from "react";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

const ProductCheckoutCard = ({
  productName,
  productImage,
  winningPrice,
  sellerName,
  qrCodeUrl,
  className = "",
}) => {
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  return (
    <>
      {/* --- MAIN CARD --- */}
      <div
        className={twMerge(
          "flex h-48 w-full max-w-4xl bg-white rounded-2xl shadow-[0_4px_20px_-5px_rgba(59,130,246,0.2)] border border-blue-100 p-4 relative overflow-hidden transition-all hover:shadow-blue-200/50",
          className
        )}
      >
        <div className="absolute left-0 top-0 h-full w-1.5 bg-linear-to-b from-blue-400 to-purple-600"></div>

        {/* Left Side: Product Image */}
        <div className="h-full w-40 shrink-0 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase tracking-wider">
            Won
          </div>
        </div>

        {/* Middle Side: Details */}
        <div className="flex flex-1 flex-col justify-center ml-6 pr-4 py-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 mb-1">
              {productName}
            </h3>
            <div className="h-0.5 w-12 bg-blue-200 rounded-full mb-3"></div>
          </div>

          <div className="mt-auto">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
              Winning Bid Amount
            </p>
            <div className="flex items-baseline text-blue-700">
              <span className="text-sm font-semibold mr-1">$</span>
              <span className="text-3xl font-extrabold tracking-tight">
                {winningPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment & Seller */}
        <div className="flex flex-col items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">
          {/* QR Code Container 
            - Added 'cursor-pointer' to indicate it's clickable.
            - Added onClick handler to open the modal.
          */}
          <div 
            onClick={() => setIsQrZoomed(true)}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group relative cursor-pointer"
          >
            <img
              src={qrCodeUrl}
              alt="Scan to Pay"
              className="size-24 object-contain rounded-lg group-hover:opacity-90 transition-opacity"
            />
            {/* Tooltip now hints at the click action */}
            <div className="absolute inset-0 bg-blue-900/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-bold text-center">Click to<br/>Enlarge</span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
              Pay to Seller
            </p>
            <div className="flex items-center justify-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <div className="size-4 rounded-full bg-linear-to-tr from-blue-400 to-purple-600 mr-2"></div>
              <p className="text-sm font-bold text-gray-700 truncate max-w-[110px]">
                {sellerName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- HIDDEN MODAL / OVERLAY --- */}
      {/* This only renders when isQrZoomed is true.
         - fixed inset-0: Covers the whole screen.
         - z-50: Ensures it's on top of everything.
         - bg-black/90: The requested dark background.
      */}
      {isQrZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsQrZoomed(false)} // Clicking anywhere closes it
        >
          <div 
            className="relative bg-white p-4 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">Scan to Pay</h3>
            <p className="text-sm text-gray-500 mb-4">
              Open your banking app and scan this code
            </p>
            
            {/* The Large QR Code */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 mx-auto">
               <img 
                 src={qrCodeUrl} 
                 alt="Full Size QR" 
                 className="w-full h-auto object-contain"
               />
            </div>

            <button 
              onClick={() => setIsQrZoomed(false)}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCheckoutCard;