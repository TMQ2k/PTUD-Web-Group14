import { http } from "../libs/http";

const userEndpoint = {
  register: "/users/register",
  login: "/users/login",
  profile: "/users/profile",
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
    const response = await http.post("/users/verify-otp", otpData);
    return response.data;
  },
};
