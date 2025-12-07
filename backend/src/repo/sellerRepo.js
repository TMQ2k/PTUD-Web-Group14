import pool from "../config/db.js";

export const deactivateAllSellerExpiredRepo = async () => {
  const result = await pool.query(
    "SELECT * FROM fnc_deactivate_expired_sellers()"
  );
  return result.rows[0];
};

export const getSellerStartTimeRepo = async (sellerId) => {
  const result = await pool.query(
    "SELECT * FROM fnc_get_seller_start_time($1)",
    [sellerId]
  );
  return result.rows[0];
};
