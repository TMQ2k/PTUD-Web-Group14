import React, { useState } from "react";
import { bidderApi } from "../../api/bidder.api";
import { AlertCircle, Send } from "lucide-react";

const BiddingRequestForm = React.memo(({ productId, state }) => {
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(state);

  const handleSubmit = async () => {
    const respone = await bidderApi.requestProduct(productId, reason);
    console.log(respone);
    if (respone.code === 200) setSent(true);
  };

  return (
    <>
      {!sent ? (
        <form
          className="w-full max-w-lg flex flex-col gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Alert Section */}
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
            {/* Icon placeholder if you don't use lucide-react */}
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-red-600 font-medium leading-tight">
              Bạn chưa đủ điểm để tham gia đấu giá. Hãy gửi yêu cầu cho người
              bán.
            </p>
          </div>

          {/* Input Section */}
          <div className="flex gap-2 items-stretch">
            <textarea
              placeholder="Nhập lý do của bạn..."
              rows={2}
              className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              onChange={(e) => setReason(e.target.value)}
            />

            <button
              type="submit"
              className="px-6 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200 flex flex-col items-center justify-center whitespace-nowrap"
              onClick={handleSubmit}
            >
              <span className="text-sm">Gửi</span>
              <span className="text-xs opacity-90">Yêu cầu</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="w-full text-red-500 text-center max-w-lg flex flex-col gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          Yêu cầu của bạn đã được gửi
        </div>
      )}
    </>
  );
});

export default BiddingRequestForm;
