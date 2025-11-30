import pool from "../config/db.js";
import { BidHistory, HighestBidInfo, TopBidder } from "../model/bidModel.js";

//auto_bids(id, user_id, product_id, max_bid_amount, current_bid_amount, is_winner, created_at, updated_at)
export const getBidHistoryByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT * FROM auto_bids WHERE product_id = $1 ORDER BY created_at DESC`,
    [productId]
  );
  for (let row of result.rows) {
    const bidderResult = await pool.query(
      `SELECT u.username, ui.avatar_url FROM users u JOIN users_info ui ON u.user_id = ui.user_id WHERE u.user_id = $1`,
      [row.user_id]
    );
    row.username = bidderResult.rows[0].username;
    row.avatar_url = bidderResult.rows[0].avatar_url;
  }
  return result.rows.map(
    (row) =>
      new BidHistory(
        row.created_at,
        row.username,
        row.avatar_url,
        row.current_bid_amount
      )
  );
};

export const countHistoryByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM auto_bids WHERE product_id = $1`,
    [productId]
  );
  return parseInt(result.rows[0].count, 10);
};

export const getHighestBidInfoofUserOnProduct = async (productId, userId) => {
  const result = await pool.query(
    `SELECT max_bid_amount FROM auto_bids ab WHERE ab.product_id = $1 AND ab.user_id = $2`,
    [productId, userId]
  );
  if (result.rows.length === 0) {
    return null;
  }
  const row = result.rows[0];
  return new HighestBidInfo(row.max_bid_amount);
};

export const getTopBidderIdByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT ab.user_id FROM auto_bids ab WHERE ab.product_id = $1 ORDER BY ab.current_bid_amount DESC LIMIT 1`,
    [productId]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].user_id;
};

export const getAutoBidWinnerIdByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT ab.user_id FROM auto_bids ab WHERE ab.product_id = $1 ORDER BY ab.current_bid_amount DESC LIMIT 1`,
    [productId]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].user_id;
};

export const addItemToWatchlist = async (userId, productId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM fnc_user_watchlist_add($1, $2)`,
      [userId, productId]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi thêm sản phẩm vào watchlist:", err);
    throw err;
  }
};

export const removeItemFromWatchlist = async (userId, productId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM fnc_user_watchlist_remove($1, $2)`,
      [userId, productId]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi xóa sản phẩm khỏi watchlist:", err);
    throw err;
  }
};

export const getUserWatchlist = async (userId) => {
  const result = await pool.query(`SELECT * FROM fnc_user_watchlist($1)`, [
    userId,
  ]);
  return result.rows;
};

//dùng để thêm hoặc cập nhật auto bid
export const upsertAutoBid = async (userId, productId, maxBidAmount) => {
  try {
    const result = await pool.query(
      `SELECT * FROM fnc_upsert_auto_bid($1, $2, $3)`,
      [userId, productId, maxBidAmount]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi thêm/cập nhật auto bid:", err);
    throw err;
  }
};
//dùng để chạy tự động sau mỗi lần có bid mới
export const updateAutoBidCurrentAmount = async (productId) => {
  try {
    const result = await pool.query(`SELECT * FROM fnc_update_auto_bids($1)`, [
      productId,
    ]);
    return result.rows;
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi cập nhật current bid amount:", err);
    throw err;
  }
};
