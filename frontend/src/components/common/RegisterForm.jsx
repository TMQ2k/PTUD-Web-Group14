import React, { useState, useRef } from "react";

/**
 * RegisterUI – Giao diện đăng ký (UI-only, đã fix lỗi form)
 * - Màu chủ đạo: bg-gradient-to-r from-blue-600 to-indigo-500
 * - Có 3 bước: form → otp → done
 * - Chưa kết nối API / reCAPTCHA thật
 */

const RegisterForm = () => {
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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

    emailRef.current = email;

    // reCAPTCHA placeholder
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

    setTimeout(() => {
      setMessage("Xác thực thành công. Bạn có thể đăng nhập để đặt giá (bid).");
      setStep("done");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-blue-400 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-semibold">Đăng ký tài khoản</h1>
            <p className="opacity-90">Tạo tài khoản để có thể đặt giá (bid)</p>
          </div>

          {step === "form" && (
            <form
              onSubmit={handleRegisterSubmit}
              className="bg-white p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ tên
                </label>
                <input
                  name="fullName"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <input
                  name="address"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123 Đường ABC, Quận XYZ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email không được trùng (kiểm tra ở phía server)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mật khẩu sẽ được mã hoá bằng <b>bcrypt/scrypt</b> ở server.
                </p>
              </div>

              {/* reCAPTCHA placeholder */}
              <div className="rounded-xl border border-dashed border-gray-300 p-3">
                <div className="text-sm text-gray-600">Google reCAPTCHA</div>
                <div className="text-xs text-gray-500">
                  (Placeholder – sẽ gắn site key thật ở bước tích hợp)
                </div>
              </div>

              {error && (
                <div className="text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-green-700 bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-linear-to-r from-blue-400 to-purple-600 text-white py-2.5 font-medium hover:opacity-80 disabled:opacity-60"
              >
                {loading ? "Đang xử lý…" : "Đăng ký"}
              </button>
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
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {error && (
                <div className="text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-green-700 bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
                  {message}
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="flex-1 rounded-xl border border-gray-300 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-linear-to-r from-blue-400 to-purple-600 text-white py-2.5 font-medium hover:opacity-80 disabled:opacity-60"
                >
                  Xác nhận OTP
                </button>
              </div>
            </form>
          )}

          {step === "done" && (
            <div className="bg-white p-6">
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                Tài khoản đã được xác thực. Bạn có thể đăng nhập và bắt đầu đặt
                giá (bid).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
