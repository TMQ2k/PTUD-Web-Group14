import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSave, FaTimes } from "react-icons/fa";

const EditInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    fullName: "Quang",
    email: "quang@example.com",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    phoneNumber: "0712345678",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    setError("");
    setSuccess("");
  };

  // Validate form
  const validateForm = () => {
    // Validate email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    // Validate full name
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      setError("Họ tên phải có ít nhất 2 ký tự");
      return false;
    }

    // Nếu người dùng muốn đổi mật khẩu
    if (
      formData.newPassword ||
      formData.oldPassword ||
      formData.confirmPassword
    ) {
      // Phải nhập mật khẩu cũ
      if (!formData.oldPassword) {
        setError("Vui lòng nhập mật khẩu cũ");
        return false;
      }

      // Mật khẩu mới phải có ít nhất 8 ký tự
      if (formData.newPassword.length < 8) {
        setError("Mật khẩu mới phải có ít nhất 8 ký tự");
        return false;
      }

      // Mật khẩu xác nhận phải khớp
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return false;
      }
    }

    return true;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // TODO: Thay bằng API call thực tế
    setTimeout(() => {
      // Giả lập lưu thành công
      setSuccess("Cập nhật thông tin thành công!");
      setLoading(false);
      setIsEditing(false);

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }, 1000);
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
    // Reset form về giá trị ban đầu
    setFormData({
      fullName: "Quang",
      email: "quang@example.com",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      phoneNumber: "0712345678",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Thông tin tài khoản</h2>
          <p className="text-gray-600 text-sm mt-1">
            Quản lý thông tin cá nhân và bảo mật
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-linear-to-r from-blue-400 to-purple-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-700 transition-all"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Họ tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập họ và tên"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{formData.fullName}</p>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="example@email.com"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{formData.email}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0712345678"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                {formData.phoneNumber}
              </p>
            </div>
          )}
        </div>

        {/* Đổi mật khẩu - Chỉ hiện khi đang edit */}
        {isEditing && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Đổi mật khẩu (Tùy chọn)
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Để trống nếu không muốn thay đổi mật khẩu
            </p>

            {/* Mật khẩu cũ */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu cũ
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showOldPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mật khẩu phải có ít nhất 8 ký tự
              </p>
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Chỉ hiện khi đang edit */}
        {isEditing && (
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-400 to-purple-600 text-white rounded-lg font-bold hover:from-blue-500 hover:to-purple-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaSave className="w-4 h-4" />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaTimes className="w-4 h-4" />
              Hủy
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditInformation;
