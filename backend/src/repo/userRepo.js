import pool from "../config/db.js";
import { UserSimpleProfile } from "../model/userModel.js";

export const registerUser = async (
  username,
  password_hashed,
  email,
  role = "bidder"
) => {
  // Alias the scalar return to a stable column name so callers can read it reliably
  const result = await pool.query(
    "SELECT fnc_register_user($1, $2, $3, $4) AS message",
    [username, password_hashed, email, role]
  );
  const row = result.rows?.[0] ?? {};
  const message = row.message ?? row.fnc_register_user ?? null;
  if (!message) {
    console.warn("[Repo] registerUser unexpected row:", row);
  } else {
    console.log("Register result message:", message);
  }
  if (
    typeof message === "string" &&
    message.toLowerCase().startsWith("error:")
  ) {
    throw new Error(message);
  }
  return message;
};

export const loginUser = async (username, password_hashed) => {
  const result = await pool.query("SELECT * FROM fnc_login_user($1, $2)", [
    username,
    password_hashed,
  ]);
  return result.rows[0]; // Có thể null nếu không đúng
};

// repo/userRepo.js
// repo/userRepo.js
export const updateUserInfo = async (
  userId,
  {
    first_name,
    last_name,
    phone_number,
    birthdate,
    gender,
    address,
    avatar_url,
  }
) => {
  try {
    const result = await pool.query(
      `SELECT fnc_update_user_info($1,$2,$3,$4,$5,$6,$7,$8) AS success`,
      [
        userId,
        first_name,
        last_name,
        phone_number,
        birthdate,
        gender,
        address,
        avatar_url,
      ]
    );
    return result.rows[0].success; // true / false
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi cập nhật thông tin user:", err);
    throw err;
  }
};

export const updateAvatar = async (userId, avatar_url) => {
  try {
    const result = await pool.query(
      `UPDATE users_info SET avatar_url = $1 WHERE user_id = $2 RETURNING *`,
      [avatar_url, userId]
    );
    return result.rows[0]; // Trả về user đã được cập nhật
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi cập nhật avatar user:", err);
    throw err;
  }
};

// Xóa user bằng function DB
export const deleteUser = async (userId) => {
  try {
    await pool.query("SELECT fnc_delete_user($1)", [userId]);
    return true;
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi xóa user:", err);
    throw err;
  }
};

// Tìm user theo username để service thực hiện bcrypt.compare
export const findUserByUsername = async (username) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1 AND status = TRUE",
    [username]
  );
  return result.rows[0] || null;
};

export const getUserProfile = async (userId) => {
  const result = await pool.query("SELECT * FROM fnc_user_profile($1)", [
    userId,
  ]);
  return result.rows[0] || null;
};

export const changePassword = async (userId, newPasswordHashed) => {
  try {
    const result = await pool.query(
      `UPDATE users SET password_hashed = $1 WHERE user_id = $2 RETURNING *`,
      [newPasswordHashed, userId]
    );
    return result.rows[0]; // Trả về user đã được cập nhật
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi cập nhật mật khẩu user:", err);
    throw err;
  }
};
export const getUserInfoById = async (user_id) => {
  const userResult = await pool.query(
    `SELECT username FROM users WHERE user_id = $1`,
    [user_id]
  );
  if (userResult.rows.length === 0) {
    return null;
  }
  const userRow = userResult.rows[0];
  const userInfoResult = await pool.query(
    `SELECT avatar_url FROM users_info WHERE user_id = $1`,
    [user_id]
  );
  const userRatingResult = await pool.query(
    `SELECT rating_percent FROM users_rating WHERE user_id = $1`,
    [user_id]
  );
  return new UserSimpleProfile(
    userRow.username,
    userInfoResult.rows[0].avatar_url,
    userRatingResult.rows[0].rating_percent
  );
};

export const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT u.user_id, u.username, ui.first_name, ui.last_name, u.email, u.role, u.status
      FROM users u
      JOIN users_info ui ON u.user_id = ui.user_id
      WHERE u.role IN ('bidder', 'seller')`
  );
  const users = [];
  for (let row of result.rows) {
    users.push({
      user_id: row.user_id,
      username: row.username,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      role: row.role,
      status: row.status,
    });
  }
  return users;
};
