import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  registerUser,
  loginUser,
  getUserProfile as getUserProfileRepo,
  updateUserInfo,
  findUserByUsername,
  updateAvatar,
  changePassword,
  getAllUsers,
  deleteUserById,
  updateQRUrl,
  judgeUserRepo,
  getUserRatingRepo,
  changeStatusWonProductsRepo,
  getUserWonProductsRepo,
  getSellerDeactivatedProductsRepo,
  getBiddedProductsRepo,
  uploadPaymentPictureRepo,
  uploadSellerUrlRepo,
  getUserByNameRepo,
} from "../repo/userRepo.js";
import { sendOTPEmail } from "./emailService.js";
import crypto from "crypto";

import pool from "../config/db.js"; // ⚠️ Đảm bảo bạn đã export pool từ config DB

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Hàm tạo OTP 6 chữ số ngẫu nhiên
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (
  username,
  password,
  email,
  address,
  role = "bidder"
) => {
  // (Giữ lại validation ở service để báo lỗi sớm và user-friendly)
  const existingUsername = await pool.query(
    "SELECT 1 FROM users WHERE username = $1",
    [username]
  );
  if (existingUsername.rows.length > 0) {
    throw new Error("Username đã được sử dụng. Vui lòng chọn username khác.");
  }

  const existingEmail = await pool.query(
    "SELECT 1 FROM users WHERE email = $1",
    [email]
  );
  if (existingEmail.rows.length > 0) {
    throw new Error("Email đã được sử dụng. Vui lòng chọn email khác.");
  }

  // Hash password và gọi repo để đăng ký qua hàm DB (tạo users_info & users_rating)
  const hashed = await bcrypt.hash(password, 10);
  const registerMessage = await registerUser(
    username,
    hashed,
    email,
    address,
    role
  );

  // Kỳ vọng: "User registered successfully with ID: <id>"
  if (!registerMessage || typeof registerMessage !== "string") {
    throw new Error("Đăng ký thất bại: Không nhận được thông báo từ hệ thống.");
  }
  if (registerMessage.toLowerCase().startsWith("error:")) {
    throw new Error(registerMessage);
  }

  // Lấy user_id để tạo OTP: ưu tiên parse từ message, fallback truy vấn theo username
  let userIdMatch = registerMessage.match(/id:\s*(\d+)/i);
  let userId = userIdMatch ? Number(userIdMatch[1]) : null;
  if (!userId || Number.isNaN(userId)) {
    const lookup = await pool.query(
      "SELECT user_id FROM users WHERE username = $1",
      [username]
    );
    userId = lookup.rows?.[0]?.user_id;
  }
  if (!userId) {
    throw new Error("Đăng ký thành công nhưng không xác định được user_id.");
  }

  // 2️⃣ Tạo OTP & lưu
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
  await pool.query(
    "INSERT INTO user_otp (user_id, otp_code, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET otp_code = $2, expires_at = $3",
    [userId, otp, expiresAt]
  );

  // 3️⃣ Gửi email OTP KHÔNG ĐỢI (async)
  sendOTPEmail(email, otp).catch((err) => {
    console.error(
      "⚠️ Lỗi gửi email OTP (không ảnh hưởng response):",
      err.message
    );
  });

  console.log(`🔑 OTP cho ${email}: ${otp}`); // Log để test

  return `User created. OTP sent to ${email}`;
};

// ⚙️ Login + kiểm tra verified
export const login = async (username, password) => {
  // Lấy đủ thông tin user (bao gồm password_hashed) để kiểm tra mật khẩu
  const user = await findUserByUsername(username);
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password_hashed);
  if (!match) throw new Error("Invalid credentials");

  // ⚠️ Nếu chưa verified, tạo và gửi OTP
  if (!user.verified) {
    const otp = generateOTP();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    await pool.query(
      "INSERT INTO user_otp (user_id, otp_code, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET otp_code = $2, expires_at = $3",
      [user.user_id, otp, expires]
    );

    // ✅ Gửi email KHÔNG ĐỢI (async) để tránh timeout
    sendOTPEmail(user.email, otp).catch((err) => {
      console.error(
        "⚠️ Lỗi gửi email OTP (không ảnh hưởng response):",
        err.message
      );
    });

    console.log(`🔑 OTP cho ${user.email}: ${otp}`); // Log để test

    return {
      message: "OTP sent to your email. Please verify before logging in.",
    };
  }

  // ✅ Nếu đã verified → tạo JWT
  // Sau khi xác thực mật khẩu + verified, dùng hàm loginUser để trả dữ liệu chuẩn (lọc field)
  const loginRow = await loginUser(username, user.password_hashed);
  if (!loginRow) throw new Error("Login function returned null.");

  const token = jwt.sign(
    { id: loginRow.user_id, username: loginRow.username, role: loginRow.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user: loginRow };
};

// 🟢 Xác thực OTP
export const verifyOTP = async (identifier, otp) => {
  // ✅ Tìm user theo USERNAME hoặc EMAIL
  const result = await pool.query(
    `SELECT u.user_id, u.email, u.username, o.otp_code, o.expires_at
     FROM users u
     JOIN user_otp o ON u.user_id = o.user_id
     WHERE u.username = $1 OR u.email = $1`,
    [identifier]
  );

  const data = result.rows[0];

  // Debug log
  console.log("🔍 [verifyOTP] Tìm kiếm OTP với identifier:", identifier);
  console.log(
    "🔍 [verifyOTP] Kết quả:",
    data ? `Found user ${data.username}` : "No data"
  );

  if (!data) throw new Error("No OTP found for user");
  if (data.otp_code !== otp) {
    console.log(
      `❌ [verifyOTP] OTP không khớp. Nhận: ${otp}, DB: ${data.otp_code}`
    );
    throw new Error("Invalid OTP");
  }
  if (new Date() > data.expires_at) {
    console.log(`❌ [verifyOTP] OTP đã hết hạn. Expires: ${data.expires_at}`);
    throw new Error("OTP expired");
  }

  // ✅ Cập nhật verified = true
  await pool.query("UPDATE users SET verified = TRUE WHERE user_id = $1", [
    data.user_id,
  ]);

  console.log(`✅ [verifyOTP] User ${data.username} đã verify thành công`);

  return { message: "Email verified successfully!" };
};
export const getUserProfile = async (user_id) => {
  const user = await getUserProfileRepo(user_id);
  if (!user) throw new Error("User not found");
  return user;
};

// 🟢 Cập nhật thông tin người dùng
export const updateUserInfoService = async (user_id, userData) => {
  // Gọi hàm trong repo
  const success = await updateUserInfo(user_id, userData);

  if (!success) {
    throw new Error("Không tìm thấy user hoặc cập nhật thất bại.");
  }

  // Sau khi cập nhật thành công → lấy lại thông tin mới nhất từ DB
  const updatedUser = await pool.query(
    `SELECT user_id, first_name, last_name, phone_number, birthdate, gender, address, avatar_url 
     FROM users_info 
     WHERE user_id = $1`,
    [user_id]
  );

  return updatedUser.rows[0];
};

export const updateUserAvatarService = async (user_id, avatar_url) => {
  // Gọi hàm trong repo
  const updatedUser = await updateAvatar(user_id, avatar_url);
  if (!updatedUser) {
    throw new Error("Không tìm thấy user hoặc cập nhật avatar thất bại.");
  }
  return updatedUser;
};

export const changePasswordService = async (
  user_id,
  oldPassword,
  newPassword
) => {
  const exists = await pool.query(
    "SELECT password_hashed FROM users WHERE user_id=$1",
    [user_id]
  );
  if (exists.rows.length === 0) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(
    oldPassword,
    exists.rows[0].password_hashed
  );
  if (!match) {
    throw new Error("Old password is incorrect");
  }
  const newHashed = await bcrypt.hash(newPassword, 10);
  await changePassword(user_id, newHashed);
  return true;
};

export const sendVerifyForgotPasswordOTP = async (identifier) => {
  // Tìm user theo username hoặc email
  const result = await pool.query(
    "SELECT user_id, email FROM users WHERE username = $1 OR email = $1",
    [identifier]
  );
  const user = result.rows[0];
  if (!user) {
    throw new Error("User not found");
  }
  // Tạo OTP & lưu
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await pool.query(
    "INSERT INTO user_otp (user_id, otp_code, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET otp_code = $2, expires_at = $3",
    [user.user_id, otp, expiresAt]
  );
  // Gửi email OTP KHÔNG ĐỢI (async)
  sendOTPEmail(user.email, otp).catch((err) => {
    console.error(
      "⚠️ Lỗi gửi email OTP (không ảnh hưởng response):",
      err.message
    );
  });

  console.log(`🔑 OTP cho ${user.email}: ${otp}`); // Log để test
  return `OTP sent to ${user.email}`;
};

export const verifyForgotPasswordOTP = async (identifier, otp) => {
  // Tương tự hàm verifyOTP nhưng không cập nhật verified
  console.log(
    "[verifyForgotPasswordOTP] Bắt đầu xác thực OTP cho:",
    identifier
  );
  const result = await pool.query(
    `SELECT u.user_id, u.email, u.username, o.otp_code, o.expires_at
     FROM users u
     JOIN user_otp o ON u.user_id = o.user_id
     WHERE u.username = $1 OR u.email = $1`,
    [identifier]
  );

  const data = result.rows[0];
  if (!data) throw new Error("No OTP found for user");
  if (data.otp_code !== otp) throw new Error("Invalid OTP");
  if (new Date() > data.expires_at) throw new Error("OTP expired");
  return { message: "OTP verified successfully!" };
};

export const resetPassword = async (identifier, newPassword) => {
  // Tìm user theo username hoặc email
  const result = await pool.query(
    "SELECT user_id FROM users WHERE username = $1 OR email = $1",
    [identifier]
  );
  const user = result.rows[0];
  if (!user) {
    throw new Error("User not found");
  }
  const newHashed = await bcrypt.hash(newPassword, 10);
  await changePassword(user.user_id, newHashed);
  return { message: "Password reset successfully!" };
};

export const getAllUsersService = async () => {
  try {
    const users = await getAllUsers();
    return users;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi lấy tất cả user:", err);
    throw err;
  }
};

export const deleteUserByIdService = async (userId) => {
  try {
    await deleteUserById(userId);
    return { message: "User deleted successfully." };
  } catch (err) {
    console.error("❌ [Service] Lỗi khi xóa user theo ID:", err);
    throw err;
  }
};

export const updateUserQRUrlService = async (user_id, qr_url) => {
  const updatedUser = await updateQRUrl(user_id, qr_url);
  if (!updatedUser) {
    throw new Error("Không tìm thấy user hoặc cập nhật QR URL thất bại.");
  }
  return updatedUser;
};

export const judgeUserService = async (
  from_user_id,
  to_user_id,
  value,
  content
) => {
  try {
    const result = await judgeUserRepo(
      from_user_id,
      to_user_id,
      value,
      content
    );
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi đánh giá người dùng:", err);
    throw err;
  }
};

export const getUserRatingsService = async (userId) => {
  try {
    const ratings = await getUserRatingRepo(userId);
    return ratings;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi lấy đánh giá người dùng:", err);
    throw err;
  }
};

export const changeStatusWonProductsService = async (won_id, status) => {
  try {
    const result = await changeStatusWonProductsRepo(won_id, status);
    return result;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi thay đổi trạng thái sản phẩm thắng:",
      err
    );
    throw err;
  }
};

export const getUserWonProductsService = async (userId) => {
  try {
    const wonProducts = await getUserWonProductsRepo(userId);
    return wonProducts;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi lấy sản phẩm thắng của người dùng:",
      err
    );
    throw err;
  }
};

export const getSellerDeactivatedProductsService = async (sellerId) => {
  try {
    const deactivatedProducts = await getSellerDeactivatedProductsRepo(
      sellerId
    );
    return deactivatedProducts;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi lấy sản phẩm đã hủy kích hoạt của người bán:",
      err
    );
    throw err;
  }
};

export const getBiddedProductsService = async (userId) => {
  try {
    const biddedProducts = await getBiddedProductsRepo(userId);
    return biddedProducts;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi lấy sản phẩm đã đặt giá của người dùng:",
      err
    );
    throw err;
  }
};

export const uploadPaymentPictureService = async (
  wonId,
  payment_picture_url
) => {
  try {
    const result = await uploadPaymentPictureRepo(wonId, payment_picture_url);
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi tải lên hình ảnh thanh toán:", err);
    throw err;
  }
};
export const uploadSellerUrlService = async (wonId, seller_url) => {
  try {
    const result = await uploadSellerUrlRepo(wonId, seller_url);
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi tải lên URL người bán:", err);
    throw err;
  }
};

export const getUserByNameService = async (name) => {
  try {
    const result = await getUserByNameRepo(name);
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi tìm kiếm user theo tên:", err);
    throw err;
  }
};
