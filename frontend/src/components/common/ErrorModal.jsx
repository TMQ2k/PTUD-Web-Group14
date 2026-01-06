import { handleReload } from "../../utils/WindowsHandler";
import { AlertCircle } from "lucide-react";

const ErrorModal = ({ defaultMessage, error }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 p-4 flex items-center gap-3 border-b border-red-100">
          <div className="p-2 bg-red-100 rounded-full shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-red-800">Lỗi tải dữ liệu</h3>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 font-medium mb-2">
            {defaultMessage}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {error?.message ||
              "Hệ thống đang gặp sự cố gián đoạn. Vui lòng kiểm tra kết nối mạng của bạn."}
          </p>
        </div>

        {/* Footer: Error Code + Reload Text Link */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-center">
          {/* Chỉ hiển thị nút bấm */}
          <button
            onClick={handleReload}
            className="text-sm text-gray-500 hover:text-red-600 underline underline-offset-2 transition-colors cursor-pointer font-medium"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
