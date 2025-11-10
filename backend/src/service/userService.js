import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  registerUser,
  loginUser,
  getUserProfile as getUserProfileRepo,
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

export const register = async (username, password, email, role = "guest") => {
  const hashed = await bcrypt.hash(password, 10);

  // 1️⃣ Tạo user
  const result = await pool.query(
    "INSERT INTO users (username, password_hashed, email, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, hashed, email, role]
  );
  const user = result.rows[0];

  // 2️⃣ Tạo OTP & lưu
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
  await pool.query(
    "INSERT INTO user_otp (user_id, otp_code, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET otp_code = $2, expires_at = $3",
    [user.user_id, otp, expiresAt]
  );

  // 3️⃣ Gửi email OTP
  await sendOTPEmail(email, otp);

  return `User created. OTP sent to ${email}`;
};

// ⚙️ Login + kiểm tra verified
export const login = async (username, password) => {
  const userRes = await pool.query(
    "SELECT * FROM users WHERE username = $1 AND status = TRUE",
    [username]
  );
  const user = userRes.rows[0];
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

    await sendOTPEmail(user.email, otp);
    return {
      message: "OTP sent to your email. Please verify before logging in.",
    };
  }

  // ✅ Nếu đã verified → tạo JWT
  const token = jwt.sign(
    { id: user.user_id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user };
};

// 🟢 Xác thực OTP
export const verifyOTP = async (username, otp) => {
  const result = await pool.query(
    `SELECT u.user_id, u.email, o.otp_code, o.expires_at
     FROM users u
     JOIN user_otp o ON u.user_id = o.user_id
     WHERE u.username = $1`,
    [username]
  );

  const data = result.rows[0];
  if (!data) throw new Error("No OTP found for user");
  if (data.otp_code !== otp) throw new Error("Invalid OTP");
  if (new Date() > data.expires_at) throw new Error("OTP expired");

  // ✅ Cập nhật verified = true
  await pool.query("UPDATE users SET verified = TRUE WHERE user_id = $1", [
    data.user_id,
  ]);

  return { message: "Email verified successfully!" };
};
export const getUserProfile = async (user_id) => {
  const user = await getUserProfileRepo(user_id);
  if (!user) throw new Error("User not found");
  return user;
};
