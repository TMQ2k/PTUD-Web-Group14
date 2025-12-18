import { twMerge } from "tailwind-merge";
import { formatNumberToCurrency } from "../../utils/NumberHandler";
import Image from "./Image";
import { CheckCheck } from "lucide-react";
import { useState } from "react";

const SellerProductCheckoutCard = ({
  productId,
  productName,
  productImage,
  sellerName,
  sellerId,
  bidderUsername,
  bidderEmail,
  bidderAddress,
  transactionImage,
  price,
  status,
  className = "",
}) => {
  const [productStatus, setProductStatus] = useState(status);
  return (
    <>
      <div
        className={twMerge(
          "flex h-fit w-full max-w-5xl bg-white rounded-2xl shadow-[0_4px_20px_-5px_rgba(59,130,246,0.2)] border border-blue-100 p-4 relative overflow-hidden transition-all hover:shadow-blue-200/50",
          className
        )}
      >
        <div className="absolute left-0 top-0 h-full w-1.5 bg-linear-to-b from-amber-400 to-red-600"></div>
        {/* Left Side: Product Image */}
        <div className="h-full w-40 shrink-0 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full aspect-auto object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute top-0 left-0 bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase tracking-wider">
            Won
          </div>
        </div>

        {/* Middle Side: Details */}
        <div className="flex  flex-col justify-center ml-6 pr-4 py-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-4 mb-1">
              {productName}
            </h3>
            <div className="h-0.5 w-12 bg-amber-200 rounded-full mb-3"></div>
          </div>

          <div className="mt-auto">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
              Giá mua hàng
            </p>
            <div className="flex items-baseline text-amber-600">
              <span className="text-3xl font-extrabold tracking-tight">
                {formatNumberToCurrency(price)} đ
              </span>
            </div>
          </div>
        </div>
        {productStatus && (
          <div className="flex flex-col gap-4 items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">
            {productStatus === "paid" && (
              <div className="grid grid-cols-2">
                <Image src={transactionImage} alt="Transaction" />
                <div className="flex flex-col gap-4 justify-center items-center">
                  <button
                    onClick={() => setProductStatus("received")}
                    className="bg-linear-to-br from-teal-400 to-green-600 text-white 
                              rounded-lg py-2 px-2 hover:scale-102 active:scale-98 hover:shadow-lg
                              transition-all duration-300 font-semibold"
                  >
                    Xác nhận giao dịch
                  </button>
                  <button
                    //onClick={() => setProductStatus("received")}
                    className="w-full text-red-500 border-2 border-red-400 hover:bg-red-50 
                              rounded-lg py-1 px-2 hover:scale-102 active:scale-98 hover:shadow-lg
                              transition-all duration-300 font-semibold"
                  >
                    Từ chối giao dịch
                  </button>
                </div>
              </div>
            )}
            {(productStatus === "received" ||
              productStatus === "bidder_received") && (
              <>
                <CheckCheck className="size-18 stroke-green-500" />
                <div className="flex flex-col gap-2">
                  <h2 className="text-center font-bold text-lg ">
                    Thông tin người thắng
                  </h2>
                  <p className="font-bold  text-amber-500 border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                    Bidder username:{" "}
                    <span className="text-black font-semibold">
                      {bidderUsername}
                    </span>
                  </p>
                  <p className="font-bold  text-amber-500 border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                    Email:{" "}
                    <span className="text-black font-semibold">
                      {bidderEmail}
                    </span>
                  </p>
                  <p className="font-bold  text-amber-500 border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                    Address:{" "}
                    <span className="text-black font-semibold">
                      {bidderAddress}
                    </span>
                  </p>
                </div>
                {productStatus === "bidder_received" ? (
                  <p className="text-green-500 font-bold">Người thắng đã nhận hàng</p>
                ) : (
                  <p className="text-red-500 font-bold">Người thắng chưa nhận hàng</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SellerProductCheckoutCard;
