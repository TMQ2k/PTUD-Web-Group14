import pool from "../config/db.js";
import { UserSimpleProfile } from "../model/userModel.js";

export const registerUser = async (
  username,
  password_hashed,
  email,
  role = "guest"
) => {
  const result = await pool.query(
    "SELECT fnc_register_user($1, $2, $3, $4) AS message",
    [username, password_hashed, email, role]
  );
  return result.rows[0].message;
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
export const getUserProfile = async (user_id) => {
  const result = await pool.query("SELECT * FROM fnc_user_profile($1)", [
    user_id,
  ]);
  return result.rows[0] || null;
};

export const getUserInfoById = async (user_id) => {
  const userResult = await pool.query(`SELECT username FROM users WHERE user_id = $1`, [user_id]);
  if (userResult.rows.length === 0) {
      return null;
  }
  const userRow = userResult.rows[0];
  const userInfoResult = await pool.query(`SELECT avatar_url FROM users_info WHERE user_id = $1`, [user_id]);
  const userRatingResult = await pool.query(`SELECT rating_percent FROM users_rating WHERE user_id = $1`, [user_id]);
  return new UserSimpleProfile(
      userRow.username,
      userInfoResult.rows[0].avatar_url,
      userRatingResult.rows[0].rating_percent
  );
} 
