import React, { useState } from "react";
import { FaSave } from "react-icons/fa";

const EditAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    firstName: "Quang",
    lastName: "Trần Minh",
    phoneNumber: "",
    address: "2",
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
    // Validate first name
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      setError("First name phải có ít nhất 2 ký tự");
      return false;
    }

    // Validate last name
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      setError("Last name phải có ít nhất 2 ký tự");
      return false;
    }

    // Validate phone number
    if (!formData.phoneNumber) {
      setError("Vui lòng nhập số điện thoại");
      return false;
    }

    // Validate phone format (10-11 số)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
      setError("Số điện thoại không hợp lệ (10-11 chữ số)");
      return false;
    }

    // Validate address
    if (!formData.address || formData.address.trim().length < 5) {
      setError("Địa chỉ phải có ít nhất 5 ký tự");
      return false;
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
      setSuccess("Lưu địa chỉ giao hàng thành công!");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Địa chỉ</h2>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SHIPPING ADDRESS Section */}
        <div>
          <h3 className="text-sm font-medium text-blue-600 mb-4 uppercase tracking-wide">
            ĐỊA CHỈ GIAO HÀNG
          </h3>

          <div className="space-y-4">
            {/* First name & Last name - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Nhập tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Nhập họ"
                />
              </div>
            </div>

            {/* Phone number */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phone number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaSave className="w-4 h-4" />
            {loading ? "Đang lưu..." : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
