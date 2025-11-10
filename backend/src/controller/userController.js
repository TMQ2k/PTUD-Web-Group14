import express from "express";
import {
  register,
  login,
  getUserProfile,
  verifyOTP,
} from "../service/userService.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const msg = await register(username, password, email, role);

    res.status(201).json({
      code: 201,
      message: "User registered successfully",
      data: { username, email, role, note: msg },
    });
  } catch (err) {
    console.error("❌ Error in /register route:", err);

    res.status(400).json({
      code: 400,
      message: err.message || "Registration failed",
      data: null,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("🔹 [POST /login] Nhận yêu cầu đăng nhập:", { username });

    // Gọi hàm login từ service
    const result = await login(username, password);

    // Trả về dạng chuẩn REST
    return res.status(200).json({
      code: 200,
      message: "Đăng nhập thành công",
      data: {
        token: result.token,
      },
    });
  } catch (err) {
    console.error("❌ [POST /login] Lỗi:", err.message);

    // Phân biệt lỗi xác thực hay lỗi hệ thống
    if (
      err.message === "User not found" ||
      err.message === "Invalid credentials"
    ) {
      return res.status(401).json({
        code: 401,
        message: "Sai tên đăng nhập hoặc mật khẩu",
        data: null,
      });
    }

    // Lỗi khác (DB, server,...)
    return res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi trong quá trình đăng nhập",
      data: null,
      error: err.message,
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { username, otp } = req.body;
    console.log("🔹 [POST /verify-otp] Nhận yêu cầu xác thực OTP:", {
      username,
      otp,
    });

    // Gọi hàm verifyOTP trong service
    const result = await verifyOTP(username, otp);

    console.log("✅ [POST /verify-otp] Kết quả xác thực OTP:", result);

    return res.status(200).json({
      code: 200,
      message: "Xác thực OTP thành công",
      data: result ? { token: result.token } : null, // chỉ trả về token
    });
  } catch (err) {
    console.error("❌ [POST /verify-otp] Lỗi:", err.message);

    return res.status(400).json({
      code: 400,
      message: "Xác thực OTP thất bại",
      data: null,
      error: err.message, // có thể bỏ nếu không muốn show chi tiết
    });
  }
});

export default router;

router.get("/profile", authenticate, async (req, res) => {
  try {
    console.log("📥 /profile request received for user ID:", req.user.id);

    const user = await getUserProfile(req.user.id); // req.user.id từ JWT

    console.log("✅ User profile retrieved:", user);

    res.status(200).json({
      code: 200,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (err) {
    console.error("❌ Error in /profile route:", err);

    res.status(404).json({
      code: 404,
      message: err.message || "User not found",
      data: null,
    });
  }
});
