// src/utils/auth.js
const TOKEN_KEY = "auth_token";

/**
 * Utility để quản lý token trong localStorage
 */
export const authStorage = {
  /**
   * Lưu token vào localStorage
   * @param {string} token - JWT token từ backend
   */
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Lấy token từ localStorage
   * @returns {string|null} Token hoặc null nếu không có
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Xóa token khỏi localStorage
   */
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Kiểm tra có token hay không
   * @returns {boolean}
   */
  hasToken: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
