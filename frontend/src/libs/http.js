// src/libs/http.js
import axios from "axios";
import { authStorage } from "../utils/auth";

// Tạo axios instance
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR: Tự động thêm token vào header
http.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();

    // Nếu có token, thêm vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR: Xử lý lỗi 401 (token hết hạn/không hợp lệ)
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      console.warn("⚠️ Token không hợp lệ hoặc đã hết hạn");

      // Xóa token
      authStorage.removeToken();

      // Dispatch custom event để thông báo cho App.jsx logout Redux state
      window.dispatchEvent(new CustomEvent("auth:logout"));

      // Redirect về trang chủ (hoặc login)
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);
