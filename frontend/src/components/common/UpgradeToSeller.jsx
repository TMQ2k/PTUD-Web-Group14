import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { adminApi } from "../../api/admin.api";
import { toast } from "react-toastify";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const UpgradeToSeller = () => {
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null); // null, 'pending', 'approved', 'rejected'
  const [fetchingStatus, setFetchingStatus] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      // Nếu user đã là seller thì không cần fetch
      if (userData?.role === "seller") {
        setFetchingStatus(false);
        return;
      }

      try {
        setFetchingStatus(true);
        const response = await adminApi.getMyUpgradeStatus();
        // Tìm request của user hiện tại (request mới nhất)
        const myRequest = response.data?.find(
          (req) => req.user_id === userData?.user_id
        );

        if (myRequest) {
          setRequestStatus(myRequest.status);
        }
      } catch (error) {
        console.error("Error fetching upgrade status:", error);
        // Không toast error vì có thể user chưa từng gửi request
      } finally {
        setFetchingStatus(false);
      }
    };

    if (userData?.user_id) {
      fetchStatus();
    } else {
      setFetchingStatus(false);
    }
  }, [userData?.role, userData?.user_id]);

  const handleRequestUpgrade = async () => {
    try {
      setLoading(true);
      await adminApi.requestUpgradeToSeller();
      toast.success(
        "Yêu cầu nâng cấp đã được gửi! Admin sẽ xét duyệt trong vòng 7 ngày."
      );
      setRequestStatus("pending");
    } catch (error) {
      console.error("Error requesting upgrade:", error);
      toast.error(
        error.response?.data?.message || "Gửi yêu cầu nâng cấp thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  // Đang fetch status
  if (fetchingStatus) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
        <p className="text-center text-gray-600 mt-4">Đang tải trạng thái...</p>
      </div>
    );
  }

  // User đã là seller
  if (userData?.role === "seller") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">
          Tài khoản Seller
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-700 font-medium">
            ✓ Bạn đã là tài khoản Seller
          </p>
          <p className="text-green-600 text-sm mt-2">
            Bạn có thể đăng sản phẩm lên đấu giá
          </p>
        </div>
      </div>
    );
  }

  // User là bidder và có request pending
  if (requestStatus === "pending") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center mb-6">
          <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">
          Yêu cầu đang chờ xét duyệt
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 font-medium mb-3 text-center">
            ⏳ Yêu cầu nâng cấp của bạn đang được xử lý
          </p>
          <p className="text-yellow-700 text-sm text-center">
            Admin sẽ xét duyệt trong vòng 7 ngày làm việc.
            <br />
            Bạn sẽ nhận được thông báo khi có kết quả.
          </p>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">
            📋 Quy trình xét duyệt:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Bước 1: Gửi yêu cầu (Hoàn thành)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">⏳</span>
              <span>Bước 2: Admin xét duyệt (Đang xử lý)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">○</span>
              <span>Bước 3: Nhận kết quả</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // User là bidder chưa gửi request
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex items-center justify-center mb-6">
        <AlertCircle className="w-16 h-16 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">
        Nâng cấp lên tài khoản Seller
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          Lợi ích khi trở thành Seller:
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Đăng sản phẩm lên đấu giá</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Quản lý sản phẩm của bạn</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Theo dõi lượt đấu giá và người thắng</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Nhận thanh toán từ người mua</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Quy trình nâng cấp:
        </h3>
        <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
          <li>Gửi yêu cầu nâng cấp</li>
          <li>Admin xét duyệt trong vòng 7 ngày</li>
          <li>Nhận thông báo kết quả</li>
          <li>Bắt đầu đăng sản phẩm (nếu được duyệt)</li>
        </ol>
      </div>

      <button
        onClick={handleRequestUpgrade}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang gửi yêu cầu...
          </span>
        ) : (
          "Gửi yêu cầu nâng cấp"
        )}
      </button>
    </div>
  );
};

export default UpgradeToSeller;
