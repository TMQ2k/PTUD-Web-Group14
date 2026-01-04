import { twMerge } from "tailwind-merge";
import { formatNumberToCurrency } from "../../utils/NumberHandler";
import Image from "./Image";
import { CheckCheck, AlertTriangle } from "lucide-react";
import { useState } from "react";
import WonUserInformation from "./WonUserInformation";

const SellerProductCheckoutCard = ({
  productId,
  productName,
  productImage,
  wonId,
  sellerName,
  sellerId,
  transactionImage,
  price,
  status,
  onPaid,
  onChangeStatus,
  className = "",
}) => {
  const [productStatus, setProductStatus] = useState(status);
  
  const handleClick = async (updatedStatus) => {
    const respone = await onChangeStatus(wonId, updatedStatus);
    if (respone.code === 200) setProductStatus(updatedStatus);
  }

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
            {productStatus === "invalid" && (
              <div className="flex max-w-58 items-start gap-3 p-4 mb-4 text-sm text-yellow-800 border border-yellow-200 rounded-lg bg-yellow-50">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    Chưa xác nhận giao dịch
                  </h3>
                  <p className="mt-1">
                    Người đấu giá cao nhất chưa gửi ảnh giao dịch cho bạn.
                  </p>
                </div>
              </div>
            )}
            {productStatus === "sent" && (
              <div className="grid grid-cols-2">
                <Image src={transactionImage} alt="Transaction" />
                <div className="flex flex-col gap-4 justify-center items-center">
                  <button
                    onClick={() => handleClick("paid")}
                    className="bg-linear-to-br from-teal-400 to-green-600 text-white 
                              rounded-lg py-2 px-2 hover:scale-102 active:scale-98 hover:shadow-lg
                              transition-all duration-300 font-semibold"
                  >
                    Xác nhận giao dịch
                  </button>
                  <button
                    onClick={() => handleClick("invalid")}
                    className="w-full text-red-500 border-2 border-red-400 hover:bg-red-50 
                              rounded-lg py-1 px-2 hover:scale-102 active:scale-98 hover:shadow-lg
                              transition-all duration-300 font-semibold"
                  >
                    Từ chối giao dịch
                  </button>
                </div>
              </div>
            )}

            {productStatus === "paid" && (
              <WonUserInformation 
                productId={productId}
                wonId={wonId}
                onPaid={onPaid}
              />
            )} 
            {productStatus === "received" ? (
              <p className="text-green-500 font-bold">
                Người thắng đã nhận hàng
              </p>
            ) : (
              <p className="text-red-500 font-bold">
                Người thắng chưa nhận hàng
              </p>
            )}            
          </div>
        )}
      </div>
    </>
  );
};

export default SellerProductCheckoutCard;
