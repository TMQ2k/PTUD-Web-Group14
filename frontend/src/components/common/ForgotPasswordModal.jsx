import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import { userApi } from "../../api/user.api";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("email"); // "email", "otp", "newPassword"
  const [identifier, setIdentifier] = useState(""); // Email hoặc username
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Reset form khi đóng modal
  const handleClose = () => {
    setStep("email");
    setIdentifier("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  // Bước 1: Gửi OTP đến email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!identifier.trim()) {
      setError("Vui lòng nhập email hoặc tên đăng nhập.");
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.sendOtpResetPassword(identifier);

      setMessage("OTP đã được gửi! Vui lòng kiểm tra email của bạn.");
      setTimeout(() => {
        setStep("otp");
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error("❌ Lỗi gửi OTP:", err);
      setError(
        err.response?.data?.message ||
          "Không tìm thấy tài khoản. Vui lòng kiểm tra lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || String(otp).length !== 6) {
      setError("OTP phải gồm 6 chữ số.");
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.verifyOtpResetPassword({
        identifier,
        otp,
      });

      setMessage("Xác thực OTP thành công!");
      setTimeout(() => {
        setStep("newPassword");
        setMessage("");
      }, 1000);
    } catch (err) {
      console.error("❌ Lỗi xác thực OTP:", err);
      setError(
        err.response?.data?.message || "OTP không đúng hoặc đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Đặt lại mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate
    if (!newPassword || newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.resetPassword({
        identifier,
        newPassword,
        confirmPassword,
      });

      setMessage("Đặt lại mật khẩu thành công! Đang chuyển về đăng nhập...");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Lỗi đặt lại mật khẩu:", err);
      setError(
        err.response?.data?.message ||
          "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-400 to-purple-600 p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Đóng"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaLock className="w-6 h-6" />
                Quên mật khẩu
              </h2>
              <p className="text-blue-100 text-sm mt-2">
                {step === "email" && "Nhập email để nhận mã xác thực"}
                {step === "otp" && "Nhập mã OTP đã được gửi"}
                {step === "newPassword" && "Đặt mật khẩu mới cho tài khoản"}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 py-4 px-6 bg-gray-50">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === "email"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {step === "email" ? "1" : <FaCheckCircle />}
              </div>
              <div
                className={`h-1 w-12 ${
                  step !== "email" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === "otp"
                    ? "bg-blue-500 text-white"
                    : step === "newPassword"
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step === "newPassword" ? <FaCheckCircle /> : "2"}
              </div>
              <div
                className={`h-1 w-12 ${
                  step === "newPassword" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === "newPassword"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                3
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {/* Bước 1: Nhập Email */}
              {step === "email" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email hoặc Tên đăng nhập
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="your_email@example.com / username"
                        className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        autoFocus
                      />
                    </div>
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
                    className="w-full rounded-lg bg-gradient-to-r from-blue-400 to-purple-600 text-white py-3 font-bold hover:from-blue-500 hover:to-purple-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? "Đang gửi..." : "Gửi mã OTP"}
                  </button>
                </form>
              )}

              {/* Bước 2: Nhập OTP */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                      Nhập mã OTP (6 chữ số)
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={6}
                      placeholder="123456"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Mã OTP đã được gửi đến <strong>{identifier}</strong>
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

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setError("");
                        setMessage("");
                      }}
                      className="flex-1 rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-lg bg-gradient-to-r from-blue-400 to-purple-600 text-white py-3 font-bold hover:from-blue-500 hover:to-purple-700 transition-all shadow-md hover:shadow-xl disabled:opacity-60"
                    >
                      {loading ? "Đang xác thực..." : "Xác nhận"}
                    </button>
                  </div>
                </form>
              )}

              {/* Bước 3: Đặt mật khẩu mới */}
              {step === "newPassword" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <FaEye className="w-5 h-5" />
                        ) : (
                          <FaEyeSlash className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <FaEye className="w-5 h-5" />
                        ) : (
                          <FaEyeSlash className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    * Mật khẩu phải có ít nhất 6 ký tự
                  </p>

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
                    className="w-full rounded-lg bg-gradient-to-r from-blue-400 to-purple-600 text-white py-3 font-bold hover:from-blue-500 hover:to-purple-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
