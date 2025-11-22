import pool from "../config/db.js";

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
