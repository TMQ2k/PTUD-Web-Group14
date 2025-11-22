import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSave, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { userApi } from "../../api/user.api";
import { updateUserInfo } from "../../store/userSlice";
import { Check } from "lucide-react";

const EditInformation = () => {
  const dispatch = useDispatch();
  const { userData, isLoggedIn } = useSelector((state) => state.user);

  // ✅ Khai báo state TRƯỚC khi dùng trong useEffect
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data state với giá trị mặc định
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthdate: "",
    gender: "",
    address: "",
    avatarUrl: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State cho avatar upload
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh (jpg, png, gif)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Tạo preview URL cho ảnh
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setAvatarFile(file);

    setError("");
  };

  // ✅ Fetch user profile khi component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoggedIn) {
        console.warn("⚠️ User chưa đăng nhập");
        return;
      }

      try {
        setLoading(true);
        console.log("🔄 Đang lấy thông tin user...");

        const response = await userApi.getProfile();
        const apiUserData = response.data;

        console.log("✅ Lấy thông tin thành công:", apiUserData);

        // ✅ Cập nhật formData với dữ liệu từ API
        setFormData({
          firstName: apiUserData.first_name || "",
          lastName: apiUserData.last_name || "",
          email: apiUserData.email || "",
          phoneNumber: apiUserData.phone_number || "",
          birthdate: apiUserData.birthdate || "",
          gender: apiUserData.gender || "",
          address: apiUserData.address || "",
          avatarUrl: apiUserData.avatar_url || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Set avatar preview nếu có
        if (apiUserData.avatar_url) {
          setAvatarPreview(apiUserData.avatar_url);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin user:", error);
        console.error("❌ Error details:", error.response?.data);
        setError(
          error.response?.data?.message || "Không thể lấy thông tin người dùng"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isLoggedIn]);

  // ✅ Cleanup preview URL khi component unmount
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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

  // Handle avatar file change

  // Validate form
  const validateForm = () => {
    // Validate first name
    if (!formData.firstName || formData.firstName.trim().length < 1) {
      setError("Vui lòng nhập tên");
      return false;
    }

    // Validate last name
    if (!formData.lastName || formData.lastName.trim().length < 1) {
      setError("Vui lòng nhập họ");
      return false;
    }

    // Validate email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    // Validate phone number
    if (formData.phoneNumber && !/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      setError("Số điện thoại phải có 10-11 chữ số");
      return false;
    }

    // Nếu người dùng muốn đổi mật khẩu (nhập vào bất kỳ trường nào)
    if (
      formData.newPassword ||
      formData.oldPassword ||
      formData.confirmPassword
    ) {
      // Phải nhập đầy đủ cả 3 trường
      if (!formData.oldPassword) {
        setError("Vui lòng nhập mật khẩu cũ để đổi mật khẩu");
        return false;
      }

      if (!formData.newPassword) {
        setError("Vui lòng nhập mật khẩu mới");
        return false;
      }

      if (!formData.confirmPassword) {
        setError("Vui lòng xác nhận mật khẩu mới");
        return false;
      }

      // Mật khẩu mới phải có ít nhất 8 ký tự
      if (formData.newPassword.length < 8) {
        setError("Mật khẩu mới phải có ít nhất 8 ký tự");
        return false;
      }

      // Mật khẩu xác nhận phải khớp
      if (formData.newPassword !== formData.confirmPassword) {
        console.log("🔍 Debug password mismatch:");
        console.log("  - newPassword:", JSON.stringify(formData.newPassword));
        console.log(
          "  - confirmPassword:",
          JSON.stringify(formData.confirmPassword)
        );
        console.log("  - Length new:", formData.newPassword.length);
        console.log("  - Length confirm:", formData.confirmPassword.length);
        setError(
          `Mật khẩu xác nhận không khớp (${formData.newPassword.length} ≠ ${formData.confirmPassword.length} ký tự)`
        );
        return false;
      }
    }

    return true;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Đang cập nhật thông tin...");

      // ✅ Nếu có avatar mới, upload trước
      let avatarResponse = null;
      if (avatarFile) {
        console.log("📸 Đang upload avatar...");
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        try {
          avatarResponse = await userApi.updateAvatar(formData);
          console.log("✅ Upload avatar thành công:", avatarResponse);
          setSuccess("Cập nhật avatar thành công!");
        } catch (avatarError) {
          console.error("❌ Lỗi khi upload avatar:", avatarError);
          setError(
            avatarError.response?.data?.message ||
              "Không thể upload avatar. Vui lòng thử lại."
          );
          setLoading(false);
          return;
        }
      }

      // ✅ Chuẩn bị dữ liệu để gửi (theo format backend yêu cầu)
      const updateData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone_number: formData.phoneNumber,
        birthdate: formData.birthdate || null,
        gender: formData.gender || null,
        address: formData.address || null,
      };

      console.log("📤 Dữ liệu gửi đi:", updateData);

      // ✅ Gọi API cập nhật
      const response = await userApi.updateProfile(updateData);

      console.log("✅ Cập nhật thành công:", response);

      // ✅ Fetch lại profile để có dữ liệu mới nhất (bao gồm avatar URL từ Cloudinary)
      const updatedProfile = await userApi.getProfile();
      const updatedUserData = updatedProfile.data;

      console.log("✅ Profile mới nhất:", updatedUserData);

      // ✅ Nếu user nhập mật khẩu mới, gọi API đổi mật khẩu
      let passwordChanged = false;
      if (formData.newPassword && formData.oldPassword) {
        try {
          console.log("🔄 Đang đổi mật khẩu...");
          await userApi.changePassword({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          });
          console.log("✅ Đổi mật khẩu thành công");
          passwordChanged = true;
        } catch (passwordError) {
          console.error("❌ Lỗi khi đổi mật khẩu:", passwordError);
          setError(
            passwordError.response?.data?.message ||
              passwordError.response?.data?.error ||
              "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ."
          );
          setLoading(false);
          return;
        }
      }

      // ✅ Cập nhật Redux store với dữ liệu mới nhất
      dispatch(
        updateUserInfo({
          name: `${updatedUserData.first_name || ""} ${
            updatedUserData.last_name || ""
          }`.trim(),
          email: updatedUserData.email,
          // Avatar URL mới nhất từ database (đã được cập nhật bởi upload avatar)
          avatar: updatedUserData.avatar_url,
          role: updatedUserData.role,
        })
      );

      // ✅ Cập nhật formData với avatar URL mới
      setFormData((prev) => ({
        ...prev,
        avatarUrl: updatedUserData.avatar_url,
      }));

      // ✅ Cập nhật preview với URL mới từ server
      if (avatarResponse?.data?.avatar_url) {
        setAvatarPreview(avatarResponse.data.avatar_url);
      } else if (updatedUserData.avatar_url) {
        setAvatarPreview(updatedUserData.avatar_url);
      }

      // Success message
      let successMsg = "Cập nhật thông tin thành công!";
      if (avatarFile && passwordChanged) {
        successMsg = "Cập nhật thông tin, avatar và mật khẩu thành công!";
      } else if (avatarFile) {
        successMsg = "Cập nhật thông tin và avatar thành công!";
      } else if (passwordChanged) {
        successMsg = "Cập nhật thông tin và mật khẩu thành công!";
      }

      setSuccess(successMsg);
      setIsEditing(false);

      // Reset avatar file và password fields sau khi thành công
      setAvatarFile(null);
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      console.error("❌ Error response:", error.response?.data);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Cập nhật thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    setIsEditing(false);
    setError("");
    setSuccess("");

    // ✅ Reload lại dữ liệu từ API
    try {
      const response = await userApi.getProfile();
      const apiUserData = response.data;

      setFormData({
        firstName: apiUserData.first_name || "",
        lastName: apiUserData.last_name || "",
        email: apiUserData.email || "",
        phoneNumber: apiUserData.phone_number || "",
        birthdate: apiUserData.birthdate || "",
        gender: apiUserData.gender || "",
        address: apiUserData.address || "",
        avatarUrl: apiUserData.avatar_url || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Reset avatar
      setAvatarPreview(apiUserData.avatar_url || null);
      setAvatarFile(null);
    } catch (error) {
      console.error("❌ Lỗi khi reload dữ liệu:", error);
    }
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
        {/* Avatar Upload Section */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
          {/* Avatar Preview */}
          <div className="relative">
            <img
              src={
                avatarPreview ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  `${formData.firstName} ${formData.lastName}`.trim() || "User"
                )}&size=128&background=4F46E5&color=fff`
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            {isEditing && (
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg"
                title="Thay đổi ảnh đại diện"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Avatar Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              Ảnh đại diện
            </h3>
            {isEditing ? (
              <>
                <p className="text-sm text-gray-500">
                  Chọn ảnh đại diện mới (jpg, png, gif). Kích thước tối đa 5MB.
                </p>
                {avatarFile && (
                  <div className="flex items-center gap-2 mt-2">
                    <Check className="text-green-600 w-4 h-4" />
                    <span className="text-sm text-green-600 font-medium">
                      {avatarFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        // Reset về avatar cũ
                        setAvatarPreview(formData.avatarUrl || null);
                      }}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên <span className="text-red-500">*</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập tên"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                {formData.firstName || "Chưa cập nhật"}
              </p>
            </div>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ <span className="text-red-500">*</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập họ"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                {formData.lastName || "Chưa cập nhật"}
              </p>
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
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
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
                    <FaEye className="w-5 h-5" />
                  ) : (
                    <FaEyeSlash className="w-5 h-5" />
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
                    <FaEye className="w-5 h-5" />
                  ) : (
                    <FaEyeSlash className="w-5 h-5" />
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
                    <FaEye className="w-5 h-5" />
                  ) : (
                    <FaEyeSlash className="w-5 h-5" />
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
