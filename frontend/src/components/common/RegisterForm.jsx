import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { userApi } from "../../api/user.api";
import { useDispatch } from "react-redux";
import { registerSuccess } from "../../store/userSlice";
import { authStorage } from "../../utils/auth";

const RegisterForm = ({ isOpen, onClose, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const user = useRef({});

  // Reset form khi đóng modal
  const handleClose = () => {
    setStep("form");
    setError("");
    setMessage("");
    setRecaptchaToken(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    onClose();
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const address = formData.get("address");

    if (!username || !email || !password || !confirmPassword || !address) {
      setError("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    if (address.trim().length < 5) {
      setError("Địa chỉ phải có ít nhất 5 ký tự.");
      setLoading(false);
      return;
    }

    // ✅ Kiểm tra reCAPTCHA
    if (!recaptchaToken) {
      setError("Vui lòng xác nhận rằng bạn không phải là robot.");
      setLoading(false);
      return;
    }

    if (String(password).length < 8) {
      setError("Mật khẩu tối thiểu 8 ký tự.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Đang đăng ký user...");

      // ✅ BƯỚC 1: Gọi API đăng ký
      await userApi.register({ username, email, password, address });

      console.log("✅ Đăng ký thành công! OTP đã được gửi tới email.");

      // ✅ BƯỚC 2: Lưu thông tin user để dùng khi verify OTP
      user.current = { username, email, password };

      // ✅ BƯỚC 3: Hiển thị form OTP
      setMessage("Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.");
      setStep("otp");

      // Reset reCAPTCHA
      setRecaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.error("❌ Đăng ký thất bại:", error);
      setError(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );

      // Tự động ẩn thông báo lỗi sau 2 giây
      setTimeout(() => {
        setError("");
      }, 2000);

      // Reset reCAPTCHA khi có lỗi
      setRecaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp");

    console.log("🔄 Đang verify OTP:", otp);

    if (!otp || String(otp).length !== 6) {
      setError("OTP phải gồm 6 chữ số.");
      setLoading(false);
      return;
    }

    try {
      // ✅ BƯỚC 1: Gọi API verify OTP
      const verifyResponse = await userApi.verifyOtp({
        email: user.current.email,
        otp,
      });

      console.log("📦 Response verify OTP:", verifyResponse);

      // ✅ BƯỚC 2: Lấy token từ response
      const token = verifyResponse.data?.token;

      if (!token) {
        throw new Error("Backend không trả về token sau khi verify");
      }

      console.log("✅ Xác thực OTP thành công! Token:", token);

      // ✅ BƯỚC 3: Lưu token vào localStorage
      authStorage.setToken(token);

      // ✅ BƯỚC 4: Lấy thông tin user (hoặc dùng data từ verify response)
      let userData;

      if (verifyResponse.data?.user) {
        // Backend trả user luôn trong verify response
        userData = verifyResponse.data.user;
        console.log("✅ User data từ verify response:", userData);
      } else {
        // Gọi API getProfile để lấy user
        try {
          const profileResponse = await userApi.getProfile();
          userData = profileResponse.data;
          console.log("✅ User data từ /profile:", userData);
        } catch (profileError) {
          console.warn(
            "⚠️ Không lấy được profile, dùng data tạm:",
            profileError
          );
          // Fallback: Dùng data từ form
          userData = {
            name: user.current.username,
            email: user.current.email,
            role: "bidder",
          };
        }
      }

      // ✅ BƯỚC 5: Lưu vào Redux
      const fullName = `${userData.first_name || ""} ${
        userData.last_name || ""
      }`.trim();
      const displayName =
        fullName || userData.name || userData.username || user.current.username;

      dispatch(
        registerSuccess({
          id: userData.id,
          name: displayName,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar || null,
        })
      );

      setMessage("Xác thực OTP thành công! Đang đăng nhập...");

      // ✅ BƯỚC 6: Đóng modal
      setTimeout(() => {
        handleClose();
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
          onClick={handleClose}
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
          <div className="bg-linear-to-r from-blue-400 to-purple-600 p-4 text-white relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Đóng"
            >
              <FaTimes className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-semibold">Đăng ký tài khoản</h1>
            <p className="opacity-90 text-sm">
              Tạo tài khoản để có thể đặt giá (bid)
            </p>
          </div>

          {step === "form" && (
            <form
              onSubmit={handleRegisterSubmit}
              className="bg-white p-4 space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  name="username"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập tên người dùng"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center transform scale-90 origin-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={
                    import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
                    "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  }
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken(null)}
                  onErrored={() => setRecaptchaToken(null)}
                />
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
                disabled={loading || !recaptchaToken}
                className="w-full rounded-lg bg-linear-to-r from-blue-400 to-purple-600 text-white py-2 text-sm font-bold hover:from-blue-500 hover:to-purple-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý…" : "Đăng ký"}
              </button>

              {/* Divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">hoặc</span>
                </div>
              </div>

              {/* Switch to Login */}
              <p className="text-center text-xs text-gray-600">
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
            <form onSubmit={handleOtpSubmit} className="bg-white p-4 space-y-3">
              <p className="text-xs text-gray-700">
                Nhập mã OTP đã gửi tới{" "}
                <span className="font-medium">{user.current.email}</span>.
              </p>
              <input
                name="otp"
                type="text"
                maxLength={6}
                inputMode="numeric"
                placeholder="123456"
                autoFocus
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-lg font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />

              {error && (
                <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-2 text-xs">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-2 text-xs">
                  {message}
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="flex-1 rounded-lg border-2 border-gray-300 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-linear-to-r from-blue-400 to-purple-600 text-white py-2 text-sm font-bold hover:from-blue-500 hover:to-purple-700 transition-all shadow-md hover:shadow-xl disabled:opacity-60"
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
