import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import QRcode from "./QRcode";
import ProductReceivedButton from "./ProductReceivedButton";
import { formatNumberToCurrency } from "../../utils/NumberHandler";
// Added AlertCircle for the cancellation message
import { FileText, X, Download, AlertCircle } from "lucide-react";

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
    billImage,
    onChangeStatus,
    className = "",
  }) => {
    const [showBill, setShowBill] = useState(false);

    // Helper to render the View Bill Button since it's used in two states now
    const renderBillButton = () => (
      <button
        onClick={() => setShowBill(true)}
        className="
          flex items-center justify-center gap-2 w-full 
          bg-white border border-blue-200 text-blue-600 
          hover:bg-blue-50 hover:border-blue-300 
          py-2 rounded-lg font-semibold text-sm transition-all shadow-sm
        "
      >
        <FileText size={16} />
        <span>Xem hóa đơn</span>
      </button>
    );

    return (
      <>
        {/* --- MAIN CARD --- */}
        <div
          className={twMerge(
            "flex h-fit min-h-40 w-full max-w-5xl bg-white rounded-2xl shadow-[0_4px_20px_-5px_rgba(59,130,246,0.2)] border border-blue-100 p-4 relative overflow-hidden transition-all hover:shadow-blue-200/50",
            className
          )}
        >
          {/* Status color bar: Change to Red if cancelled, else Blue/Purple */}
          <div
            className={twMerge(
              "absolute left-0 top-0 h-full w-1.5",
              status === "cancelled"
                ? "bg-red-500"
                : "bg-linear-to-b from-blue-400 to-purple-600"
            )}
          ></div>

          {/* Left Side: Product Image */}
          <div className="w-40 min-h-40 shrink-0 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
            <img
              src={productImage}
              alt={productName}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div
              className={twMerge(
                "absolute top-0 left-0  text-white text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase tracking-wider shadow-sm z-10",
                status === "cancelled" ? "bg-red-500" : "bg-blue-600"
              )}
            >
              Won
            </div>
          </div>

          {/* Middle Side: Details */}
          <div className="flex flex-1 flex-col justify-center ml-6 pr-4 py-2 min-w-0">
            <div>
              <h3
                className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 mb-2"
                title={productName}
              >
                {productName}
              </h3>
              <div className="h-0.5 w-12 bg-blue-200 rounded-full mb-3"></div>
            </div>

            <div className="mt-auto">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                Giá mua hàng
              </p>
              <div
                className={twMerge(
                  "flex items-baseline",
                  status === "cancelled"
                    ? "text-gray-400 line-through"
                    : "text-blue-700"
                )}
              >
                <span className="text-2xl font-extrabold tracking-tight">
                  {formatNumberToCurrency(winningPrice)} đ
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: QR / Payment / Status */}
          <div className="flex flex-col items-center justify-center gap-3 w-72 shrink-0 border-l border-dashed border-gray-200 pl-4 py-1">
            {/* --- CASE 1: CANCELLED --- */}
            {status === "cancelled" ? (
              <div className="flex flex-col gap-3 w-full items-center justify-center h-full">
                {/* Only allow viewing bill if it exists */}
                {billImage && renderBillButton()}

                <div className="flex flex-col items-center justify-center text-center gap-2 p-3 w-full bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="text-red-500" size={24} />
                  <span className="text-red-700 font-bold text-sm">
                    Đơn hàng đã bị
                    <br />
                    người bán huỷ
                  </span>
                </div>
              </div>
            ) : /* --- CASE 2: PAID OR RECEIVED --- */
            status === "paid" || status === "received" ? (
              <div className="flex flex-col gap-3 w-full items-center">
                {billImage && renderBillButton()}

                <ProductReceivedButton
                  productId={productId}
                  wonId={wonId}
                  status={status}
                  onChangeStatus={onChangeStatus}
                />
              </div>
            ) : (
              /* --- CASE 3: DEFAULT (PENDING PAYMENT) --- */
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
        </div>

        {/* --- BILL MODAL --- */}
        {showBill && billImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowBill(false)}
            ></div>
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  Hóa đơn thanh toán
                </h3>
                <button
                  onClick={() => setShowBill(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="p-4 bg-gray-100 overflow-y-auto flex-1 flex items-center justify-center">
                <img
                  src={billImage}
                  alt="Bill Receipt"
                  className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                />
              </div>
              <div className="p-4 border-t flex justify-end gap-2">
                <a
                  href={billImage}
                  download={`Bill-${wonId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                >
                  <Download size={16} /> Tải về / Mở ảnh gốc
                </a>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

export default ProductCheckoutCard;
