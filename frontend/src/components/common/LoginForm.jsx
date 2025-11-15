import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { userApi } from "../../api/user.api";
import { authStorage } from "../../utils/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/userSlice";

const LoginForm = ({ isOpen, onClose, onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState("login"); // "login" hoặc "otp"
  const [userEmail, setUserEmail] = useState(""); // Lưu email để verify OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Xử lý verify OTP (khi user chưa verify email)
  const handleOtpSubmit = async (e) => {
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

    try {
      console.log("🔄 Đang verify OTP cho email:", userEmail);

      // ✅ Gọi API verify OTP
      const verifyResponse = await userApi.verifyOtp({
        email: userEmail,
        otp,
      });

      console.log("📦 Response verify OTP:", verifyResponse);

      // ✅ Lấy token từ response
      const token = verifyResponse.data?.token;

      if (!token) {
        throw new Error("Backend không trả về token sau khi verify");
      }

      console.log("✅ Xác thực OTP thành công! Token:", token);

      // ✅ Lưu token vào localStorage
      authStorage.setToken(token);

      // ✅ Lấy thông tin user
      let userData;

      if (verifyResponse.data?.user) {
        userData = verifyResponse.data.user;
        console.log("✅ User data từ verify response:", userData);
      } else {
        try {
          const profileResponse = await userApi.getProfile();
          userData = profileResponse.data;
          console.log("✅ User data từ /profile:", userData);
        } catch (profileError) {
          console.warn("⚠️ Không lấy được profile:", profileError);
          userData = {
            email: userEmail,
            role: "buyer",
          };
        }
      }

      // ✅ Lưu vào Redux
      dispatch(
        loginSuccess({
          id: userData.id,
          name: userData.username || userData.name,
          email: userData.email,
          role: userData.role || "buyer",
          avatar: userData.avatar || null,
        })
      );

      setMessage("Xác thực thành công! Đang đăng nhập...");

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("❌ Xác thực OTP thất bại:", error);
      setError(
        error.response?.data?.message ||
          "Xác thực OTP thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    const remember = Boolean(formData.get("remember"));

    if (!username || username.length < 3) {
      setError("Tên đăng nhập tối thiểu 3 ký tự.");
      setLoading(false);
      return;
    }
    if (!password || password.length < 8) {
      setError("Mật khẩu tối thiểu 8 ký tự.");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Đang gọi API login...");

      // ✅ BƯỚC 1: Gọi API login
      const loginResponse = await userApi.login({ username, password });

      console.log("📦 Response từ backend:", loginResponse);

      // ✅ BƯỚC 2: Kiểm tra có cần verify OTP không
      if (loginResponse.data?.needVerification) {
        console.log("⚠️ User chưa verify email, cần nhập OTP");

        // Lưu email để dùng khi verify OTP
        setUserEmail(loginResponse.data.email);

        // Hiển thị thông báo
        setMessage(
          "Tài khoản chưa được xác thực. OTP đã được gửi tới email của bạn."
        );

        // Chuyển sang bước nhập OTP
        setStep("otp");
        setLoading(false);
        return;
      }

      // ✅ BƯỚC 3: User đã verify → Lấy token
      const token = loginResponse.data?.token;

      if (!token) {
        throw new Error("Backend không trả về token");
      }

      console.log("✅ Đăng nhập thành công, token:", token);

      // ✅ BƯỚC 4: Lưu token vào localStorage
      authStorage.setToken(token);

      console.log("💾 Đã lưu token vào localStorage");
      console.log(
        "🔍 Kiểm tra: localStorage.getItem('auth_token') =",
        localStorage.getItem("auth_token")
      );

      // ✅ BƯỚC 5: Gọi API getProfile (tạm thời skip nếu backend chưa sẵn sàng)
      try {
        const profileResponse = await userApi.getProfile();
        const userData = profileResponse.data;

        console.log("✅ Lấy thông tin user thành công:", userData);

        dispatch(
          loginSuccess({
            id: userData.id,
            name: `${userData.first_name} ${userData.last_name}`,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar || null,
          })
        );
      } catch (profileError) {
        console.warn(
          "⚠️ API /profile chưa sẵn sàng, tạm thời dùng data từ login:",
          profileError
        );

        // Fallback: Dùng username từ form (tạm thời)
        dispatch(
          loginSuccess({
            name: username,
            email: `${username}@example.com`, // Tạm thời
            role: "buyer",
            avatar: null,
          })
        );
      }

      onClose();
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      console.error("❌ Chi tiết lỗi:", error.response?.data);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-semibold tracking-tight">
              {step === "login" ? "Đăng nhập" : "Xác thực OTP"}
            </h1>
            <p className="opacity-90">
              {step === "login"
                ? "Truy cập tài khoản để tham gia đặt giá (bid)"
                : "Nhập mã OTP đã được gửi tới email của bạn"}
            </p>
          </div>

          {/* Form Login */}
          {step === "login" && (
            <form onSubmit={handleSubmit} className="bg-white p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="your_username"
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
          )}

          {/* Form OTP - Copy từ RegisterForm */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="bg-white p-6 space-y-4">
              <p className="text-sm text-gray-700">
                Nhập mã OTP đã gửi tới{" "}
                <span className="font-medium">{userEmail}</span>.
              </p>
              <input
                name="otp"
                type="text"
                maxLength={6}
                inputMode="numeric"
                placeholder="123456"
                autoFocus
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-xl font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  onClick={() => {
                    setStep("login");
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

export default LoginForm;
