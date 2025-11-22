import { useState } from "react";
import { CheckCircle, XCircle, Clock, Calendar } from "lucide-react";

const RequestManagement = () => {
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, expired

  // Mock data - TODO: Replace with API call
  const mockRequests = [
    {
      id: 1,
      user_id: 5,
      username: "user123",
      email: "user123@example.com",
      full_name: "Nguyễn Văn A",
      status: "pending",
      requested_at: "2024-03-10T10:30:00",
      approved_at: null,
      expires_at: null,
    },
    {
      id: 2,
      user_id: 7,
      username: "bidder456",
      email: "bidder456@example.com",
      full_name: "Trần Thị B",
      status: "approved",
      requested_at: "2024-03-08T14:20:00",
      approved_at: "2024-03-08T15:00:00",
      expires_at: "2024-03-15T15:00:00",
    },
    {
      id: 3,
      user_id: 9,
      username: "tempSeller",
      email: "temp@example.com",
      full_name: "Lê Văn C",
      status: "expired",
      requested_at: "2024-02-20T09:00:00",
      approved_at: "2024-02-20T10:00:00",
      expires_at: "2024-02-27T10:00:00",
    },
  ];

  const filteredRequests = mockRequests.filter((request) => {
    if (filterStatus === "all") return true;
    return request.status === filterStatus;
  });

  const handleApprove = (requestId, userId) => {
    // TODO: Approve request API call
    // Backend should:
    // 1. Update user role to "seller"
    // 2. Set expires_at to current_time + 7 days
    // 3. Create a scheduled job to downgrade role after 7 days
    console.log("Approve request:", requestId, "for user:", userId);
  };

  const handleReject = (requestId) => {
    // TODO: Reject request API call
    console.log("Reject request:", requestId);
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
      expired: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Hết hạn",
        icon: XCircle,
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
            onClick={() => setFilterStatus("expired")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "expired"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Hết hạn
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày yêu cầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hết hạn
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
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không có yêu cầu nào
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {request.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDateTime(request.requested_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {request.expires_at
                        ? formatDateTime(request.expires_at)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status, request.expires_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(request.id, request.user_id)
                              }
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Duyệt (7 ngày)"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {request.status === "approved" && (
                          <span className="text-xs text-gray-500 italic">
                            Đang hoạt động
                          </span>
                        )}
                        {request.status === "expired" && (
                          <span className="text-xs text-gray-500 italic">
                            Đã kết thúc
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestManagement;
