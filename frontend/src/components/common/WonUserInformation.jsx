import { useEffect, useState } from "react";
import { FourSquare } from "react-loading-indicators";
import { CheckCheck } from "lucide-react";
import Dialog from "./Dialog"; // Adjust path as needed

const WonUserInformation = ({ isOpen, onClose, wonId, productId, onPaid }) => {
  const [bidderInfo, setBidderInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if the modal is actually open
    if (!isOpen) return;

    let isMounted = true;

    const loadBidderInformation = async () => {
      try {
        setLoading(true);
        setError(null);
        // Assuming onPaid returns the data object directly
        const respone = await onPaid(wonId, productId);
        if (isMounted) setBidderInfo(respone?.winningBidderId || {});
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBidderInformation();

    return () => {
      isMounted = false;
    };
  }, [isOpen, wonId, productId, onPaid]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={!loading && !error ? "Chi tiết đơn hàng" : "Đang xử lý"}
    >
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        {loading && (
          <div className="flex flex-col items-center gap-4">
            <FourSquare color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
            <p className="text-sm text-gray-500">Đang tải thông tin...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg w-full">
            <p className="font-semibold">Đã xảy ra lỗi</p>
            <p className="text-sm mt-1">
              {error?.message || "Không thể lấy thông tin người thắng"}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="w-full animate-fade-in">
            <div className="flex flex-col items-center mb-6">
              <div className="rounded-full bg-green-100 p-3 mb-2">
                <CheckCheck className="size-10 stroke-green-600" />
              </div>
              <h2 className="text-center font-bold text-xl text-gray-800">
                Thông tin người thắng
              </h2>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <InfoRow label="Bidder username" value={bidderInfo.username} />
              <InfoRow label="Email" value={bidderInfo.email} />
              <InfoRow label="SĐT" value={bidderInfo.phone} />
              <InfoRow label="Địa chỉ" value={bidderInfo.address} />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

// Helper component for cleaner rows
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 shadow-sm">
    <span className="text-sm font-medium text-amber-600">{label}:</span>
    {value ? (
      <span className="text-sm font-semibold text-gray-900 mt-1 sm:mt-0">
        {value}
      </span>
    ) : (
      <span className="text-sm font-semibold text-red-700 mt-1 sm:mt-0">
        Chưa có thông tin
      </span>
    )}
  </div>
);

export default WonUserInformation;
