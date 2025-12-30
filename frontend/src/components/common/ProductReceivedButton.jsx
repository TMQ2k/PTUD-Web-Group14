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
    <div className="flex flex-col items-center gap-4 justify-center pl-6 ml-2 border-l-2 border-gray-200/70 shrink-0">
      <div className={`border-4 p-3 rounded-full ${received === "received" ? "border-green-500" : "border-blue-500"}`}>
        {received === "received" ? (
          <CheckCheck className="size-18 stroke-green-500" />
        ) : (
          <Truck className="size-18 stroke-blue-500" />
        )}
      </div>
      {received === "received" ? (
        <div className="text-green-500 text-lg font-bold">
          Bạn đã nhận hàng
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="hover:scale-102 active:scale-98 transition-all duration-300 hover:shadow-lg bg-linear-to-br from-blue-400 to-purple-600 p-2 text-white rounded-lg font-bold"
        >
          Đã nhận hàng
        </button>
      )}
    </div>
  );
});

export default ProductReceivedButton;
