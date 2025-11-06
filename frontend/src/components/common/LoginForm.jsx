import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

const testUser = {
  name: "Nguyen Van A",
  email: "nguyenvana@example.com",
  avatar: null,
};

const LoginForm = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const remember = Boolean(formData.get("remember"));

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Vui lòng nhập email hợp lệ.");
      setLoading(false);
      return;
    }
    if (!password || password.length < 8) {
      setError("Mật khẩu tối thiểu 8 ký tự.");
      setLoading(false);
      return;
    }

    // UI-only: mô phỏng phản hồi đăng nhập
    setTimeout(() => {
      if (email.endsWith("@unverified.com")) {
        setError(
          "Tài khoản chưa xác thực email. Vui lòng kiểm tra hộp thư để hoàn tất OTP trước khi đăng nhập."
        );
        setLoading(false);
      } else {
        // Đăng nhập thành công
        const mockUser = {
          name: email.split("@")[0],
          email: email,
          avatar: null,
        };
        localStorage.setItem("user", JSON.stringify(mockUser));

        // Đóng modal và refresh
        onClose();
        window.location.reload();
      }
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop mờ */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header gradient */}
          <div className="bg-linear-to-r from-blue-400 to-purple-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Đóng"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
            <p className="opacity-90">
              Truy cập tài khoản để tham gia đặt giá (bid)
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="remember"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                Nhớ tôi
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Quên mật khẩu?
              </button>
            </div>

            <p className="text-xs text-gray-500">
              * Chỉ tài khoản đã xác thực email mới có thể đặt giá.
            </p>

            {error && (
              <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-linear-to-r from-blue-400 to-purple-600 text-white py-3 font-bold hover:from-blue-500 hover:to-purple-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Đang xử lý…" : "Đăng nhập"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">hoặc</span>
              </div>
            </div>

            {/* Switch to Register */}
            <p className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Đăng ký ngay
              </button>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginForm;
