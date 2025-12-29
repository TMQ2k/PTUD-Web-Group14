import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { adminApi } from "../../api/admin.api";
import { toast } from "react-toastify";

const RequestManagement = ({ onRequestUpdated }) => {
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected, expired
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUpgradeRequests();
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching upgrade requests:", error);
      toast.error("Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (filterStatus === "all") return true;
    return request.status === filterStatus;
  });

  const handleApprove = async (userId, username) => {
    if (
      !window.confirm(
        `Duyệt yêu cầu nâng cấp của "${username}" lên Seller trong 7 ngày?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await adminApi.handleUpgradeRequest(userId, true);
      toast.success("Đã duyệt yêu cầu! User sẽ là Seller trong 7 ngày.");
      await fetchRequests();
      onRequestUpdated?.();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error(error.response?.data?.message || "Duyệt yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId, username) => {
    if (!window.confirm(`Từ chối yêu cầu nâng cấp của "${username}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await adminApi.handleUpgradeRequest(userId, false);
      toast.success("Đã từ chối yêu cầu.");
      await fetchRequests();
      onRequestUpdated?.();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error(error.response?.data?.message || "Từ chối yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRemainingDays = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status, expiresAt) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Chờ duyệt",
        icon: Clock,
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Đã duyệt",
        icon: CheckCircle,
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Từ chối",
        icon: XCircle,
      },
      expired: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Hết hạn",
        icon: Clock,
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    const remainingDays =
      status === "approved" ? getRemainingDays(expiresAt) : null;

    return (
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
          <Icon className="w-3 h-3" />
          {config.label}
        </span>
        {status === "approved" && remainingDays !== null && (
          <span className="text-xs text-gray-600">
            (còn {remainingDays} ngày)
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Quản lý Requests
        </h2>
        <p className="text-gray-600">
          Xử lý yêu cầu nâng cấp lên Seller (7 ngày)
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Thông tin về hệ thống Request:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Bidder có thể yêu cầu quyền Seller tạm thời trong 7 ngày</li>
              <li>
                Sau khi được duyệt, vai trò sẽ tự động hạ xuống Bidder sau 7
                ngày
              </li>
              <li>Admin cần xem xét kỹ trước khi phê duyệt</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "pending"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Chờ duyệt
          </button>
          <button
            onClick={() => setFilterStatus("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "approved"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => setFilterStatus("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "rejected"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Từ chối
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-2">Đang tải...</p>
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không có yêu cầu nào
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    return (
                      <tr
                        key={request.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {request.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status, request.expires_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3">
                            {request.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleApprove(
                                      request.user_id,
                                      request.username
                                    )
                                  }
                                  disabled={loading}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 active:bg-green-800 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                                  title="Duyệt (7 ngày)"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Duyệt</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleReject(
                                      request.user_id,
                                      request.username
                                    )
                                  }
                                  disabled={loading}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 active:bg-red-800 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                                  title="Từ chối"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>Từ chối</span>
                                </button>
                              </>
                            )}
                            {request.status === "approved" && (
                              <span className="text-xs text-gray-500 italic">
                                Đã phê duyệt
                              </span>
                            )}
                            {request.status === "rejected" && (
                              <span className="text-xs text-red-500 italic">
                                Đã từ chối
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestManagement;
