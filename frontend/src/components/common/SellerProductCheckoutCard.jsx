// import { twMerge } from "tailwind-merge";
// import { formatNumberToCurrency } from "../../utils/NumberHandler";
// import Image from "./Image";
// import { CheckCheck, AlertTriangle } from "lucide-react";
// import { useState } from "react";
// import { Trophy } from "lucide-react";
// import WonUserInformation from "./WonUserInformation";

// const SellerProductCheckoutCard = ({
//   productId,
//   productName,
//   productImage,
//   wonId,
//   sellerName,
//   sellerId,
//   transactionImage,
//   price,
//   status,
//   onPaid,
//   onChangeStatus,
//   className = "",
// }) => {
//   const [productStatus, setProductStatus] = useState(status);
//   const [showWinnerModal, setShowWinnerModal] = useState(false);

//   const handleClick = async (updatedStatus) => {
//     const respone = await onChangeStatus(wonId, updatedStatus);
//     if (respone.code === 200) setProductStatus(updatedStatus);
//   };

//   return (
//     <>
//       <div
//         className={twMerge(
//           "flex h-fit w-full max-w-5xl bg-white rounded-2xl shadow-[0_4px_20px_-5px_rgba(59,130,246,0.2)] border border-blue-100 p-4 relative overflow-hidden transition-all hover:shadow-blue-200/50",
//           className
//         )}
//       >
//         <div className="absolute left-0 top-0 h-full w-1.5 bg-linear-to-b from-amber-400 to-red-600"></div>
//         {/* Left Side: Product Image */}
//         <div className="h-full w-40 shrink-0 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
//           <img
//             src={productImage}
//             alt={productName}
//             className="h-full w-full aspect-auto object-cover transition-transform duration-500 hover:scale-110"
//           />
//           <div className="absolute top-0 left-0 bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase tracking-wider">
//             Won
//           </div>
//         </div>

//         {/* Middle Side: Details */}
//         <div className="flex  flex-col justify-center ml-6 pr-4 py-2">
//           <div>
//             <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-4 mb-1">
//               {productName}
//             </h3>
//             <div className="h-0.5 w-12 bg-amber-200 rounded-full mb-3"></div>
//           </div>

//           <div className="mt-auto">
//             <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
//               Giá mua hàng
//             </p>
//             <div className="flex items-baseline text-amber-600">
//               <span className="text-3xl font-extrabold tracking-tight">
//                 {formatNumberToCurrency(price)} đ
//               </span>
//             </div>
//           </div>
//         </div>
//         {productStatus && (
//           <div className="flex flex-col gap-4 items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">
//             {productStatus === "invalid" && (
//               <div className="flex max-w-58 items-start gap-3 p-4 mb-4 text-sm text-yellow-800 border border-yellow-200 rounded-lg bg-yellow-50">
//                 <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
//                 <div>
//                   <h3 className="font-semibold text-yellow-900">
//                     Chưa xác nhận giao dịch
//                   </h3>
//                   <p className="mt-1">
//                     Người đấu giá cao nhất chưa gửi ảnh giao dịch cho bạn.
//                   </p>
//                 </div>
//               </div>
//             )}
//             {productStatus === "sent" && (
//               <>
//                 <div className="grid grid-cols-2">
//                   <Image src={transactionImage} alt="Transaction" />
//                   <div className="flex flex-col gap-4 justify-center items-center">
//                     <button
//                       onClick={() => handleClick("paid")}
//                       className="bg-linear-to-br from-teal-400 to-green-600 text-white
//                               rounded-lg py-2 px-2 hover:scale-102 active:scale-98 hover:shadow-lg
//                               transition-all duration-300 font-semibold"
//                     >
//                       Xác nhận giao dịch
//                     </button>
//                     <button
//                       onClick={() => handleClick("invalid")}
//                       className="w-full text-red-500 border-2 border-red-400 hover:bg-red-50
//                               rounded-lg py-1 px-2 hover:scale-102 active:scale-98 hover:shadow-lg
//                               transition-all duration-300 font-semibold"
//                     >
//                       Từ chối giao dịch
//                     </button>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowWinnerModal(true)}
//                   className="
//                     group
//                     flex items-center gap-2
//                     bg-amber-500 hover:bg-amber-600 active:bg-amber-700
//                     text-white font-semibold text-sm
//                     px-5 py-2.5
//                     rounded-full
//                     shadow-md hover:shadow-lg hover:shadow-amber-500/30
//                     transition-all duration-200 ease-in-out
//                     transform hover:-translate-y-0.5
//                   "
//                 >
//                   <Trophy className="size-4 transition-transform group-hover:rotate-12" />
//                   <span>Xem người thắng</span>
//                 </button>

//                 <WonUserInformation
//                   isOpen={showWinnerModal}
//                   onClose={() => setShowWinnerModal(false)}
//                   wonId="123"
//                   productId="456"
//                   onPaid={onPaid}
//                 />
//               </>
//             )}

//             {productStatus === "paid" && (
//               <></>
//               // <WonUserInformation
//               //   productId={productId}
//               //   wonId={wonId}
//               //   onPaid={onPaid}
//               // />
//             )}
//             {productStatus === "received" ? (
//               <p className="text-green-500 font-bold">
//                 Người thắng đã nhận hàng
//               </p>
//             ) : (
//               <p className="text-red-500 font-bold">
//                 Người thắng chưa nhận hàng
//               </p>
//             )}
//           </div>
//         )}
//         <div className="mt-auto pt-2 border-t border-gray-100 w-full flex justify-center">
//           <button
//             onClick={() => handleClick("cancelled")}
//             className="flex items-center gap-2 text-gray-400 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200 group"
//             title="Hủy giao dịch này"
//           >
//             <XCircle className="size-5 group-hover:rotate-90 transition-transform duration-300" />
//             <span className="font-medium text-sm">Hủy giao dịch</span>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SellerProductCheckoutCard;

import { twMerge } from "tailwind-merge";
import { formatNumberToCurrency } from "../../utils/NumberHandler";
import {
  Trophy,
  XCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";
import WonUserInformation from "./WonUserInformation";
import TransactionProcessModal from "./TransactionProcessModal";

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
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);

  // General handler for simple status changes (cancel, reject)
  const handleClick = async (updatedStatus) => {
    const response = await onChangeStatus(wonId, updatedStatus);
    if (response?.code === 200) setProductStatus(updatedStatus);
  };

  // Specific handler for CONFIRMING payment (Receives the file from the Modal)
  const handleConfirmTransaction = async (billFile) => {
    // 1. Here you have the file! You can append it to FormData
    console.log("Bill File received from modal:", billFile);

    // 2. Call your API (assuming onChangeStatus can handle the file)
    // You might need to adjust your API to accept a third argument (the file)
    const response = await onChangeStatus(wonId, "paid", billFile);

    // 3. Update UI
    if (response?.code === 200) {
      setProductStatus("paid");
      setShowProcessModal(false);
    }
  };

  return (
    <>
      <div
        className={twMerge(
          "flex h-36 w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden transition-all hover:shadow-md",
          className
        )}
      >
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-amber-400 to-red-600"></div>

        {/* Left Side: Product Image */}
        <div className="h-full w-36 shrink-0 relative bg-gray-100 border-r border-gray-100">
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-0 left-0 bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase">
            Won
          </div>
        </div>

        {/* Middle Side: Details */}
        <div className="flex flex-col justify-center ml-4 pr-4 py-2 flex-grow min-w-0">
          <h3
            className="text-base font-bold text-gray-900 leading-tight line-clamp-2 mb-1"
            title={productName}
          >
            {productName}
          </h3>
          <div className="h-0.5 w-10 bg-amber-200 rounded-full mb-2"></div>

          <div className="mt-auto">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
              Giá chốt
            </p>
            <div className="flex items-baseline text-amber-600">
              <span className="text-xl font-extrabold tracking-tight">
                {formatNumberToCurrency(price)} đ
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex flex-col gap-2 items-center justify-center px-4 border-l border-dashed border-gray-200 w-48 shrink-0 bg-gray-50/50">
          
          {/* Status Badge */}
          {productStatus === "sent" && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              Chờ xử lý
            </span>
          )}

          {/* Primary Action Button */}
          {productStatus === "sent" ? (
            <button
              onClick={() => setShowProcessModal(true)}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FileText size={16} />
              <span>Xử lý giao dịch</span>
            </button>
          ) : productStatus === "invalid" ? (
            <div className="text-xs text-center text-yellow-700 bg-yellow-100 p-2 rounded">
              Chờ ảnh giao dịch
            </div>
          ) : null}

          {/* Secondary Actions */}
          <button
            onClick={() => setShowWinnerModal(true)}
            className="text-xs text-gray-500 hover:text-amber-600 flex items-center gap-1 transition-colors"
          >
            <Trophy size={14} />
            Xem người thắng
          </button>

          <button
            onClick={() => handleClick("cancelled")}
            className="mt-1 text-xs text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <XCircle size={14} />
            Hủy đơn
          </button>
        </div>
      </div>

      {/* --- MODALS --- */}

      <WonUserInformation
        isOpen={showWinnerModal}
        onClose={() => setShowWinnerModal(false)}
        wonId={wonId}
        productId={productId}
        onPaid={onPaid}
      />

      {/* HERE IS THE CORRECT INTEGRATION */}
      <TransactionProcessModal
        isOpen={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        transactionImage={transactionImage}
        
        // This receives the file from the Modal state
        onConfirm={handleConfirmTransaction}
        
        // This handles rejection
        onReject={() => {
            handleClick("invalid");
            setShowProcessModal(false);
        }}
      />
    </>
  );
};

export default SellerProductCheckoutCard;