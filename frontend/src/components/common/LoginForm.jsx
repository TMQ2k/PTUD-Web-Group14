import React, { useState } from "react";

/**
 * LoginUI – Giao diện đăng nhập (UI-only)
 * - Màu chủ đạo: bg-gradient-to-r from-blue-600 to-indigo-500
 * - Trường: Email, Mật khẩu, "Nhớ tôi"
 * - reCAPTCHA placeholder để gắn sau
 * - Có mô phỏng trạng thái: đăng nhập thành công, email chưa xác thực
 */

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
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

    // reCAPTCHA placeholder – sẽ bổ sung token thật khi tích hợp
    const fakeCaptchaToken = "captcha_token_placeholder";
    if (!fakeCaptchaToken) {
      setError("Vui lòng xác thực reCAPTCHA.");
      setLoading(false);
      return;
    }

    // UI-only: mô phỏng phản hồi đăng nhập
    // Giả lập case email chưa xác thực → cảnh báo; ngược lại → thành công
    setTimeout(() => {
      if (email.endsWith("@unverified.com")) {
        setError("");
        setMessage(
          "Tài khoản chưa xác thực email. Vui lòng kiểm tra hộp thư để hoàn tất OTP trước khi đăng nhập."
        );
      } else {
        setError("");
        setMessage(
          `Đăng nhập thành công${
            remember ? " (đã bật Nhớ tôi)" : ""
          }. Bạn có thể tiếp tục đặt giá (bid).`
        );
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-xl overflow-hidden">
          {/* Header gradient */}
          <div className="bg-linear-to-r from-blue-400 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
            <p className="opacity-90">
              Truy cập tài khoản để tham gia đặt giá (bid)
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center justify-between mt-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" name="remember" className="rounded" />
                  Nhớ tôi
                </label>
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                * Chỉ tài khoản đã xác thực email mới có thể đặt giá.
              </p>
            </div>

            {/* reCAPTCHA Placeholder */}
            <div className="rounded-xl border border-dashed border-gray-300 p-3">
              <div className="text-sm text-gray-600">Google reCAPTCHA</div>
              <div className="text-xs text-gray-500">
                (Placeholder – sẽ gắn site key thật khi tích hợp)
              </div>
            </div>

            {error && (
              <div className="text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-blue-400 to-purple-600 text-white py-2.5 font-medium hover:opacity-80 disabled:opacity-60"
            >
              {loading ? "Đang xử lý…" : "Đăng nhập"}
            </button>

            <div className="text-sm text-gray-600 text-center">
              Chưa có tài khoản?{" "}
              <span className="text-indigo-600">Đăng ký ngay</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
