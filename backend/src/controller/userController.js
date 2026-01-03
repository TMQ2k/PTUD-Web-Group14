import express from "express";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/upload.js";
import jwt from "jsonwebtoken";
import {
  register,
  login,
  getUserProfile,
  verifyOTP,
  updateUserInfoService,
  updateUserAvatarService,
  changePasswordService,
  sendVerifyForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
  getAllUsersService,
  deleteUserByIdService,
  updateUserQRUrlService,
  judgeUserService,
  getUserRatingsService,
  getSellerDeactivatedProductsService,
  getUserWonProductsService,
  changeStatusWonProductsService,
  getBiddedProductsService,
  uploadPaymentPictureService,
  uploadSellerUrlService,
  getUserByNameService,
} from "../service/userService.js";
import { authenticate, authorize } from "../middleware/auth.js";
import pool from "../config/db.js"; // Import pool để query email

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, email, address, role } = req.body;
    const msg = await register(username, password, email, address, role);

    res.status(201).json({
      code: 201,
      message: "User registered successfully",
      data: { username, email, role, address, note: msg },
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

router.get("/profile", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user_id từ token
    const userProfile = await getUserProfile(userId);

    res.status(200).json({
      code: 200,
      message: "Lấy thông tin user thành công",
      data: userProfile,
    });
  } catch (err) {
    console.error("❌ [GET /profile] Lỗi:", err.message);
    res.status(500).json({
      code: 500,
      message: "Lấy thông tin user thất bại",
      error: err.message,
    });
  }
});

router.patch(
  "/update-avatar",
  authenticate,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: "Không có file được gửi lên",
        });
      }

      // Upload file lên Cloudinary bằng upload_stream
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      const userId = req.user.id; // Lấy user_id từ token
      console.log(userId);

      // Cập nhật avatar_url trong DB
      await updateUserAvatarService(userId, uploadResult.secure_url);

      return res.status(200).json({
        code: 200,
        message: "Upload avatar thành công",
        data: {
          avatar_url: uploadResult.secure_url,
        },
      });
    } catch (err) {
      console.error("❌ Lỗi upload avatar:", err);
      res.status(500).json({
        code: 500,
        message: "Upload thất bại",
        error: err.message,
      });
    }
  }
);

router.patch(
  "/update-url",
  authenticate,
  upload.single("qr_url"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: "Không có file được gửi lên",
        });
      }

      // Upload file lên Cloudinary bằng upload_stream
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "qr_url" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      const userId = req.user.id; // Lấy user_id từ token
      console.log(userId);

      // Cập nhật avatar_url trong DB
      await updateUserQRUrlService(userId, uploadResult.secure_url);

      return res.status(200).json({
        code: 200,
        message: "Upload qr thành công",
        data: {
          qr_url: uploadResult.secure_url,
        },
      });
    } catch (err) {
      console.error("❌ Lỗi upload avatar:", err);
      res.status(500).json({
        code: 500,
        message: "Upload thất bại",
        error: err.message,
      });
    }
  }
);

router.put("/change-password", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user_id từ token
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        code: 400,
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
      });
    }
    await changePasswordService(userId, oldPassword, newPassword);

    res.status(200).json({
      code: 200,
      message: "Đổi mật khẩu thành công",
    });
  } catch (err) {
    console.error("❌ [PUT /change-password] Lỗi:", err.message);
    res.status(500).json({
      code: 500,
      message: "Đổi mật khẩu thất bại",
      error: err.message,
    });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { identifier } = req.body;
    // Gọi hàm gửi OTP từ service
    const msg = await sendVerifyForgotPasswordOTP(identifier);

    res.status(200).json({
      code: 200,
      message: "OTP sent successfully",
      data: { note: msg },
    });
  } catch (err) {
    console.error("❌ Error in /send-otp route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to send OTP",
      data: null,
    });
  }
});

router.post("/verify-otp-reset-pass", async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    // Gọi hàm verify OTP từ service
    console.log(identifier, otp);
    await verifyForgotPasswordOTP(identifier, otp);
    res.status(200).json({
      code: 200,
      message: "OTP verified successfully",
      data: null,
    });
  } catch (err) {
    console.error("❌ Error in /verify-otp route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to verify OTP",
      data: null,
    });
  }
});

router.put("/reset-password", async (req, res) => {
  try {
    const { identifier, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        code: 400,
        message: "New password and confirm password do not match",
      });
    }
    await resetPassword(identifier, newPassword);
    res.status(200).json({
      code: 200,
      message: "Password reset successfully",
      data: null,
    });
  } catch (err) {
    console.error("❌ Error in /reset-password route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to reset password",
      data: null,
    });
  }
});

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({
      code: 200,
      message: "Lấy tất cả user thành công",
      data: users,
    });
  } catch (err) {
    console.error("❌ [GET /users] Lỗi:", err.message);
    res.status(500).json({
      code: 500,
      message: "Lấy tất cả user thất bại",
      error: err.message,
    });
  }
});

// Thêm route test này TRƯỚC route delete
router.post("/test-body", (req, res) => {
  console.log("🧪 Test body:", req.body);
  res.json({
    received: req.body,
    type: typeof req.body.userId,
    hasUserId: !!req.body.userId,
  });
});

// TEST - bỏ tạm để kiểm tra logic
router.delete(
  "/delete-user",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { userId } = req.body;
      const userIdNumber = parseInt(userId, 10);

      console.log("✅ userId parsed:", userIdNumber);

      if (!userId || isNaN(userIdNumber)) {
        return res.status(400).json({
          code: 400,
          message: "Invalid user id",
        });
      }

      const result = await deleteUserByIdService(userIdNumber);

      return res.status(200).json({
        code: 200,
        message: "Xóa user thành công",
        data: result,
      });
    } catch (err) {
      console.error("❌ Lỗi:", err.message);
      return res.status(500).json({
        code: 500,
        message: "Xóa user thất bại",
        error: err.message,
      });
    }
  }
);

router.post("/judge-user", authenticate, async (req, res) => {
  try {
    const from_user_id = req.user.id;
    const { to_user_id, value, content } = req.body;
    const result = await judgeUserService(
      from_user_id,
      to_user_id,
      value,
      content
    );
    res.status(200).json({
      code: 200,
      message: "Successfully judged user",
      data: result,
    });
  } catch (err) {
    console.error("❌ Error in /judge-user route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to judge user",
      data: null,
    });
  }
});

router.get("/user-ratings", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const ratings = await getUserRatingsService(userId);
    res.status(200).json({
      code: 200,
      message: "Lấy đánh giá người dùng thành công",
      data: ratings,
    });
  } catch (err) {
    console.error("❌ Error in /user-ratings/:userId route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to get user ratings",
      data: null,
    });
  }
});

router.get("/seller-deactivated-products", authenticate, async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await getSellerDeactivatedProductsService(sellerId);
    res.status(200).json({
      code: 200,
      message: "Lấy sản phẩm hết hạn thành công",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in /seller-deactivated-products route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to get deactivated products",
      data: null,
    });
  }
});

router.get("/user-won-products", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await getUserWonProductsService(userId);
    res.status(200).json({
      code: 200,
      message: "Lấy sản phẩm đã thắng thành công",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in /user-won-products route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to get won products",
      data: null,
    });
  }
});

router.put("/change-won-product-status", async (req, res) => {
  try {
    const { wonId, status } = req.body;
    const result = await changeStatusWonProductsService(wonId, status);
    res.status(200).json({
      code: 200,
      message: "Successfully changed won product status",
      data: result,
    });
  } catch (err) {
    console.error("❌ Error in /change-won-product-status route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to change won product status",
      data: null,
    });
  }
});

router.get("/bidded-products", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await getBiddedProductsService(userId);
    res.status(200).json({
      code: 200,
      message: "Lấy sản phẩm đã đấu giá thành công",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in /bidded-products route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to get bidded products",
      data: null,
    });
  }
});

router.patch(
  "/upload-payment-picture",
  authenticate,
  upload.single("payment_picture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: "Không có file được gửi lên",
        });
      }
      const { wonId } = req.body;

      // Upload file lên Cloudinary bằng upload_stream
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "payment_pictures" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      // Cập nhật payment_picture_url trong DB
      await uploadPaymentPictureService(wonId, uploadResult.secure_url);
      return res.status(200).json({
        code: 200,
        message: "Upload payment picture thành công",
        data: {
          payment_picture_url: uploadResult.secure_url,
        },
      });
    } catch (err) {
      console.error("❌ Lỗi upload payment picture:", err);
      res.status(500).json({
        code: 500,
        message: "Upload thất bại",
        error: err.message,
      });
    }
  }
);

router.patch(
  "/upload-seller-url",
  authenticate,
  upload.single("seller_url"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: "Không có file được gửi lên",
        });
      }
      const { wonId } = req.body;

      // Upload file lên Cloudinary bằng upload_stream
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "seller_urls" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      // Cập nhật seller_url trong DB
      await uploadSellerUrlService(wonId, uploadResult.secure_url);
      return res.status(200).json({
        code: 200,
        message: "Upload seller url thành công",
        data: {
          seller_url: uploadResult.secure_url,
        },
      });
    } catch (err) {
      console.error("❌ Lỗi upload seller url:", err);
      res.status(500).json({
        code: 500,
        message: "Upload thất bại",
        error: err.message,
      });
    }
  }
);

router.get("/search-by-name", async (req, res) => {
  try {
    const { name } = req.query;
    const users = await getUserByNameService(name);
    res.status(200).json({
      code: 200,
      message: "Tìm kiếm user thành công",
      data: users,
    });
  } catch (err) {
    console.error("❌ Error in /search-by-name route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to search users by name",
      data: null,
    });
  }
});

export default router;
