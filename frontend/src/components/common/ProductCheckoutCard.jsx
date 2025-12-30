import React from "react";
import { twMerge } from "tailwind-merge";
import QRcode from "./QRcode";
import ProductReceivedButton from "./ProductReceivedButton";
import { formatNumberToCurrency } from "../../utils/NumberHandler";

const ProductCheckoutCard = React.memo(
  ({
    productName,
    productId,
    wonId,
    productImage,
    winningPrice,
    sellerName,
    qrCodeUrl,
    status,
    onChangeStatus,
    className = "",
  }) => {
    return (
      <>
        {/* --- MAIN CARD --- */}
        <div
          className={twMerge(
            "flex h-fit w-full max-w-4xl bg-white rounded-2xl shadow-[0_4px_20px_-5px_rgba(59,130,246,0.2)] border border-blue-100 p-4 relative overflow-hidden transition-all hover:shadow-blue-200/50",
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
              <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-4 mb-1">
                {productName}
              </h3>
              <div className="h-0.5 w-12 bg-blue-200 rounded-full mb-3"></div>
            </div>

            <div className="mt-auto">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                Giá mua hàng
              </p>
              <div className="flex items-baseline text-blue-700">
                <span className="text-3xl font-extrabold tracking-tight">
                  {formatNumberToCurrency(winningPrice)} đ
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Payment & Seller */}
          {status === "paid" || status === "received" ? (
            <ProductReceivedButton
              productId={productId}
              wonId={wonId}
              status={status}
              onChangeStatus={onChangeStatus}
            />
          ) : (
            <QRcode
              sellerName={sellerName}
              qrCodeUrl={qrCodeUrl}
              productId={productId}
              wonId={wonId}
              status={status}
              onChangeStatus={onChangeStatus}
            />
          )}
        </div>
      </>
    );
  }
);

export default ProductCheckoutCard;
