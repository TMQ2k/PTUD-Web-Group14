import express from "express";
import jwt from "jsonwebtoken";
import {
  register,
  login,
  getUserProfile,
  verifyOTP,
  updateUserInfoService,
  deleteUserService,
} from "../service/userService.js";
import { authenticate, authorize } from "../middleware/auth.js";
import pool from "../config/db.js"; // Import pool để query email

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

    // ✅ Kiểm tra: User chưa verify → Trả về needVerification
    if (result.message && !result.token) {
      // User chưa verify, OTP đã được gửi

      // Lấy email của user để trả về frontend
      const userRes = await pool.query(
        "SELECT email FROM users WHERE username = $1",
        [username]
      );
      const email = userRes.rows[0]?.email;

      console.log("⚠️ [POST /login] User chưa verify, OTP đã gửi tới:", email);

      return res.status(200).json({
        code: 200,
        message: result.message || "OTP sent to your email. Please verify.",
        data: {
          needVerification: true,
          email: email,
        },
      });
    }

    // ✅ User đã verify → Trả về token
    console.log("✅ [POST /login] Đăng nhập thành công, trả token");

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
    const { email, username, otp } = req.body;

    // Frontend có thể gửi email hoặc username
    const identifier = email || username;

    console.log("🔹 [POST /verify-otp] Nhận yêu cầu xác thực OTP:", {
      identifier,
      otp,
    });

    // Gọi hàm verifyOTP trong service
    const result = await verifyOTP(identifier, otp);

    console.log("✅ [POST /verify-otp] Xác thực OTP thành công");

    // ✅ Sau khi verify thành công, tạo token để user tự động login
    const userRes = await pool.query(
      "SELECT user_id, username, email, role FROM users WHERE username = $1 OR email = $1",
      [identifier]
    );
    const user = userRes.rows[0];

    if (!user) {
      throw new Error("User not found after verification");
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({
      code: 200,
      message: "Xác thực OTP thành công",
      data: {
        token: token,
      },
    });
  } catch (err) {
    console.error("❌ [POST /verify-otp] Lỗi:", err.message);

    return res.status(400).json({
      code: 400,
      message: err.message || "Xác thực OTP thất bại",
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

router.put("/update-info", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ lấy từ token
    const userData = req.body;

    const updatedUser = await updateUserInfoService(userId, userData);

    if (!updatedUser) {
      throw new Error("Không tìm thấy user hoặc cập nhật thất bại.");
    }

    res.status(200).json({
      code: 200,
      message: "Cập nhật thông tin thành công",
      data: updatedUser,
    });
  } catch (err) {
    console.error("❌ [PUT /update-info] Lỗi:", err.message);
    res.status(500).json({
      code: 500,
      message: "Cập nhật thông tin thất bại",
      error: err.message,
    });
  }
});

// DELETE /api/users/:id  (Admin only)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ code: 400, message: "Invalid user id" });
    }

    await deleteUserService(userId);
    return res.status(200).json({
      code: 200,
      message: "User deleted successfully",
      data: { user_id: userId },
    });
  } catch (err) {
    console.error("❌ [DELETE /:id] Lỗi:", err.message);
    if (err.message === "User not found") {
      return res.status(404).json({ code: 404, message: "User not found" });
    }
    return res.status(500).json({
      code: 500,
      message: "Delete user failed",
      error: err.message,
    });
  }
});

export default router;
