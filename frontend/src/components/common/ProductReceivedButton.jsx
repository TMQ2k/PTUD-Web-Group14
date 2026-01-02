// import React, { useState } from "react";
// import { Truck, CheckCheck } from "lucide-react";

// const ProductReceivedButton = React.memo(({ productId, wonId, status, onChangeStatus }) => {
//   const [received, setReceived] = useState(status);

//   const handleClick = async () => {
//     const updatedStatus = "received";
//     const respone = await onChangeStatus(wonId, updatedStatus);    
//     if (respone.code === 200) setReceived(updatedStatus);
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 justify-center pl-6 ml-2 border-l-2 border-gray-200/70 shrink-0">
//       <div className={`border-4 p-3 rounded-full ${received === "received" ? "border-green-500" : "border-blue-500"}`}>
//         {received === "received" ? (
//           <CheckCheck className="size-18 stroke-green-500" />
//         ) : (
//           <Truck className="size-18 stroke-blue-500" />
//         )}
//       </div>
//       {received === "received" ? (
//         <div className="text-green-500 text-lg font-bold">
//           Bạn đã nhận hàng
//         </div>
//       ) : (
//         <button
//           onClick={handleClick}
//           className="hover:scale-102 active:scale-98 transition-all duration-300 hover:shadow-lg bg-linear-to-br from-blue-400 to-purple-600 p-2 text-white rounded-lg font-bold"
//         >
//           Đã nhận hàng
//         </button>
//       )}
//     </div>
//   );
// });

// export default ProductReceivedButton;

import React, { useState } from "react";
import { Truck, CheckCheck } from "lucide-react";

const ProductReceivedButton = React.memo(({ productId, wonId, status, onChangeStatus }) => {
  const [received, setReceived] = useState(status);

  const handleClick = async () => {
    const updatedStatus = "received";
    const respone = await onChangeStatus(wonId, updatedStatus);    
    if (respone.code === 200) setReceived(updatedStatus);
  };

  return (
    <div className="flex flex-col items-center gap-2 justify-center w-full">
      {/* Icon Area */}
      <div className={`
        border-4 p-3 rounded-full transition-all duration-300
        ${received === "received" ? "border-green-500 bg-green-50" : "border-blue-500 bg-blue-50"}
      `}>
        {received === "received" ? (
          <CheckCheck className="size-8 stroke-green-500" /> // Reduced size from 18 to 8 for better fit
        ) : (
          <Truck className="size-8 stroke-blue-500" /> // Reduced size from 18 to 8 for better fit
        )}
      </div>

      {/* Text / Button Area */}
      {received === "received" ? (
        <div className="text-green-600 text-sm font-bold text-center">
          Đã nhận hàng
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="
            w-full mt-1
            hover:scale-102 active:scale-98 transition-all duration-300 hover:shadow-lg 
            bg-linear-to-br from-blue-400 to-purple-600 
            py-2 px-4 text-white rounded-lg font-bold text-sm
          "
        >
          Xác nhận đã nhận
        </button>
      )}
    </div>
  );
});

export default ProductReceivedButton;