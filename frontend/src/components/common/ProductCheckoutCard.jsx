import React from "react";
import { twMerge } from "tailwind-merge";

const ProductCheckoutCard = ({
  productName,
  productImage,
  winningPrice,
  sellerName,
  qrCodeUrl,
  className = "",
}) => {
  return (
    // Main Card Container
    // Used flex for horizontal layout, fixed height to ensure image uniformity,
    // and green borders/shadows to emphasize "winning".
    <div
      className={twMerge(
        "flex h-48 w-full max-w-4xl bg-white rounded-2xl shadow-[0_4px_20px_-5px_rgba(34,197,94,0.2)] border border-green-100 p-4 relative overflow-hidden transition-all hover:shadow-green-200/50",
        className
      )}
    >
      {/* Decorative "Success" side bar */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-linear-to-b from-green-400 to-green-600"></div>

      {/* --- Left Side: Product Image --- */}
      {/* h-full ensures it takes the full height of the card padding area. object-cover handles aspect ratios. */}
      <div className="h-full w-40 shrink-0 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
        <img
          src={productImage}
          alt={productName}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* Victory Badge Overlay */}
        <div className="absolute top-0 left-0 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase tracking-wider">
          Won
        </div>
      </div>

      {/* --- Middle Side: Product Details --- */}
      {/* flex-1 lets it fill available space. flex-col stacks name over price. */}
      <div className="flex flex-1 flex-col justify-center ml-6 pr-4 py-2">
        <div>
           {/* 'line-clamp-2' handles very long product names gracefully */}
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 mb-1">
            {productName}
          </h3>
           {/* Small decorative element */}
           <div className="h-0.5 w-12 bg-green-200 rounded-full mb-3"></div>
        </div>

        <div className="mt-auto">
          <p className="text-xs font-medium text-gray-500 uppercaseTracking-wider mb-0.5">
            Winning Bid Amount
          </p>
          <div className="flex items-baseline text-green-700">
            <span className="text-sm font-semibold mr-1">$</span>
            {/* Using locale string for proper comma formatting (e.g., 1,200.00) */}
            <span className="text-3xl font-extrabold tracking-tight">
              {winningPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* --- Right Side: Payment & Seller (Separated by a dashed line) --- */}
      <div className="flex flex-col items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">
        {/* QR Code Container with padding and a white background to make it pop */}
        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group relative">
          <img
            src={qrCodeUrl}
            alt="Scan to Pay"
            /* 'size-24' equals w-24 h-24. Using object-contain so the QR code isn't cut off. */
            className="size-24 object-contain rounded-lg group-hover:opacity-90 transition-opacity"
          />
          {/* Hover tooltip instruction */}
          <div className="absolute inset-0 bg-green-900/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-bold text-center">Scan<br/>to Pay</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="mt-3 text-center">
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
            Pay to Seller
          </p>
          <div className="flex items-center justify-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {/* Optional Seller Avatar placeholder */}
            <div className="size-4 rounded-full bg-linear-to-tr from-blue-400 to-purple-600 mr-2"></div>
            <p className="text-sm font-bold text-gray-700 truncate max-w-[110px]">
                {sellerName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCheckoutCard;