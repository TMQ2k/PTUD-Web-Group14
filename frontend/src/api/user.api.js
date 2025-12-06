import { http } from "../libs/http";

const userEndpoint = {
  register: "/users/register",
  login: "/users/login",
  profile: "/users/profile",
  updateAvatar: "/users/update-avatar",
  verifyOtp: "/users/verify-otp",
  updateProfile: "/users/update-info",
  changePassword: "/users/change-password",
  sendOtpResetPassword: "/users/send-otp",
  verifyOtpResetPassword: "/users/verify-otp-reset-pass",
  resetPassword: "/users/reset-password",
};

export const userApi = {
  register: async (userData) => {
    const response = await http.post(userEndpoint.register, userData);
    return response.data;
  },

  /**
   * Đăng nhập người dùng
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Thông tin người dùng sau khi đăng nhập
   */
  login: async (credentials) => {
    const response = await http.post(userEndpoint.login, credentials);
    return response.data;
  },

  /**
   * Lấy thông tin người dùng
   * @returns {Promise<Object>} Thông tin người dùng
   */
  getProfile: async () => {
    const response = await http.get(userEndpoint.profile);
    return response.data;
  },

  /**
   * OTP Verification
   * @param {Object} otpData - { email, otp }
   * @returns {Promise<Object>} Kết quả xác thực OTP
   */
  verifyOtp: async (otpData) => {
    const response = await http.post(userEndpoint.verifyOtp, otpData);
    return response.data;
  },

  /**
   * Cập nhật thông tin người dùng
   * @param {Object} userData - Dữ liệu thông tin người dùng cần cập nhật
   * @returns {Promise<Object>} Thông tin người dùng sau khi cập nhật
   */
  updateProfile: async (userData) => {
    const response = await http.put(userEndpoint.updateProfile, userData);
    return response.data;
  },

  /**
   * Cập nhật avatar người dùng
   * @param {FormData} formData - Dữ liệu FormData chứa file ảnh
   * @returns {Promise<Object>} Thông tin người dùng sau khi cập nhật avatar
   */
  updateAvatar: async (formData) => {
    const response = await http.patch(userEndpoint.updateAvatar, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Đổi mật khẩu người dùng
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise<Object>} Kết quả đổi mật khẩu
   */
  changePassword: async (passwordData) => {
    const response = await http.put(userEndpoint.changePassword, passwordData);
    return response.data;
  },

  /**
   * Gửi OTP để reset mật khẩu
   * @param {string} identifier - Email hoặc username
   * @returns {Promise<Object>} Kết quả gửi OTP
   */
  sendOtpResetPassword: async (identifier) => {
    const response = await http.post(userEndpoint.sendOtpResetPassword, {
      identifier,
    });
    return response.data;
  },

  /**
   * Xác thực OTP reset mật khẩu
   * @param {Object} otpData - { identifier, otp }
   * @returns {Promise<Object>} Kết quả xác thực OTP
   */
  verifyOtpResetPassword: async (otpData) => {
    const response = await http.post(
      userEndpoint.verifyOtpResetPassword,
      otpData
    );
    return response.data;
  },

  /**
   * Đặt lại mật khẩu
   * @param {Object} resetData - { identifier, newPassword, confirmPassword }
   * @returns {Promise<Object>} Kết quả reset mật khẩu
   */
  resetPassword: async (resetData) => {
    const response = await http.put(userEndpoint.resetPassword, resetData);
    return response.data;
  },
};
