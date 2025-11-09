import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  registerUser,
  loginUser,
  getUserProfile as getUserProfileRepo,
} from "../repo/userRepo.js";
import pool from "../config/db.js"; // ⚠️ Đảm bảo bạn đã export pool từ config DB

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const register = async (username, password, email, role = "guest") => {
  const hashed = await bcrypt.hash(password, 10);
  const msg = await registerUser(username, hashed, email, role);
  return msg;
};

export const login = async (username, password) => {
  console.log("📥 Login request received:", username);

  // 1️⃣ Lấy user trong DB
  const userRes = await pool.query(
    "SELECT * FROM users WHERE username = $1 AND status = TRUE",
    [username]
  );
  const user = userRes.rows[0];
  if (!user) throw new Error("User not found");

  // 2️⃣ So sánh mật khẩu
  const match = await bcrypt.compare(password, user.password_hashed);
  if (!match) throw new Error("Invalid credentials");

  // 3️⃣ Tạo JWT token
  const token = jwt.sign(
    { id: user.user_id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  console.log("✅ Login success for:", username);
  return { token, user };
};

// 🟢 HÀM MỚI: cập nhật verified = true cho user
export const verifyUser = async (emailOrUsername) => {
  try {
    const query = `
      UPDATE users
      SET verified = TRUE
      WHERE email = $1 OR username = $1
      RETURNING user_id, username, email, verified;
    `;

    const result = await pool.query(query, [emailOrUsername]);

    if (result.rowCount === 0) {
      throw new Error("User not found or already verified");
    }

    console.log("✅ User verified:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error updating verified:", err);
    throw err;
  }
};

export const getUserProfile = async (user_id) => {
  const user = await getUserProfileRepo(user_id);
  if (!user) throw new Error("User not found");
  return user;
};
