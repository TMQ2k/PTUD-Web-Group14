import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * RegisterForm – Modal đăng ký với 3 bước: form → otp → done
 * - Màu chủ đạo: bg-gradient-to-r from-blue-400 to-purple-600
 * - Auto refresh sau khi xác thực OTP thành công
 */

const RegisterForm = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef("");

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName");
    const address = formData.get("address");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!fullName || !address || !email || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    if (String(password).length < 8) {
      setError("Mật khẩu tối thiểu 8 ký tự.");
      setLoading(false);
      return;
    }

    emailRef.current = email;

    // Giả lập gửi OTP
    setTimeout(() => {
      setMessage("Đã gửi OTP tới email của bạn.");
      setStep("otp");
      setLoading(false);
    }, 600);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp");

    if (!otp || String(otp).length !== 6) {
      setError("OTP phải gồm 6 chữ số.");
      setLoading(false);
      return;
    }

    // Giả lập xác thực OTP thành công
    setTimeout(() => {
      // Lưu user vào localStorage
      const mockUser = {
        name: emailRef.current.split("@")[0],
        email: emailRef.current,
        avatar: null,
      };
      localStorage.setItem("user", JSON.stringify(mockUser));

      // Đóng modal và refresh
      onClose();
      window.location.reload();
    }, 600);
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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
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
            <h1 className="text-2xl font-semibold">Đăng ký tài khoản</h1>
            <p className="opacity-90">Tạo tài khoản để có thể đặt giá (bid)</p>
          </div>

          {step === "form" && (
            <form
              onSubmit={handleRegisterSubmit}
              className="bg-white p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên
                </label>
                <input
                  name="fullName"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <input
                  name="address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="123 Đường ABC, Quận XYZ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email không được trùng (kiểm tra ở phía server)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
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
                <p className="text-xs text-gray-500 mt-1">
                  Mật khẩu tối thiểu 8 ký tự, sẽ được mã hoá bằng{" "}
                  <b>bcrypt/scrypt</b> ở server.
                </p>
              </div>

              {error && (
                <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-linear-to-r from-blue-400 to-purple-600 text-white py-3 font-bold hover:from-blue-500 hover:to-purple-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Đang xử lý…" : "Đăng ký"}
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

              {/* Switch to Login */}
              <p className="text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="bg-white p-6 space-y-4">
              <p className="text-sm text-gray-700">
                Nhập mã OTP đã gửi tới{" "}
                <span className="font-medium">{emailRef.current}</span>.
              </p>
              <input
                name="otp"
                maxLength={6}
                pattern="\\d{6}"
                inputMode="numeric"
                placeholder="123456"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />

              {error && (
                <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  {message}
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="flex-1 rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-linear-to-r from-blue-400 to-purple-600 text-white py-3 font-bold hover:from-blue-500 hover:to-purple-700 transition-all shadow-md hover:shadow-xl disabled:opacity-60"
                >
                  {loading ? "Đang xử lý…" : "Xác nhận OTP"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegisterForm;
