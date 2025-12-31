import pool from "../config/db.js";
import { BidHistory, HighestBidInfo, TopBidder } from "../model/bidModel.js";
import { ProductProfile } from "../model/productModel.js";

export const getBidHistoryByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT bh.*, u.username, ui.avatar_url
    FROM product_history bh
    JOIN users u ON bh.user_id = u.user_id
    JOIN users_info ui ON u.user_id = ui.user_id
    WHERE bh.product_id = $1
    ORDER BY bh.bid_time DESC`,
    [productId]
  );
  return result.rows.map(
    (row) =>
      new BidHistory(row.bid_time, row.username, row.avatar_url, row.bid_amount)
  );
};

export const countHistoryByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM product_history WHERE product_id = $1`,
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

export const getAllBiddersByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT DISTINCT *
    FROM auto_bids ab
    JOIN users u ON ab.user_id = u.user_id
    JOIN users_info ui ON u.user_id = ui.user_id
    WHERE ab.product_id = $1`,
    [productId]
  );
  return result.rows
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

export const requestUpgradeToSeller = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM fnc_add_upgrade_request($1)`,
      [userId]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi tạo yêu cầu nâng cấp lên seller:", err);
    throw err;
  }
};

export const getUpgradeRequests = async () => {
  try {
    const result = await pool.query(`SELECT * FROM fnc_get_upgrade_requests()`);
    return result.rows;
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi lấy danh sách yêu cầu nâng cấp:", err);
    throw err;
  }
};

export const handleUpgradeRequest = async (userId, approve) => {
  try {
    const result = await pool.query(
      `SELECT * FROM fnc_change_role_for_bidder($1, $2)`,
      [userId, approve]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi xử lý yêu cầu nâng cấp:", err);
    throw err;
  }
};

export const requestBidderOnProductRepo = async (
  productId,
  bidderId,
  reason
) => {
  try {
    const result = await pool.query(
      `SELECT * FROM fnc_bidder_request_bids($1, $2, $3)`,
      [productId, bidderId, reason]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi tạo yêu cầu đấu thầu trên sản phẩm:", err);
    throw err;
  }
};

export const isBidsOnProductRepo = async (productId, bidderId) => {
  try {
    const result = await pool.query(`SELECT * FROM fnc_is_bids($1, $2)`, [
      productId,
      bidderId,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("❌ [Repo] Lỗi khi kiểm tra đấu thầu trên sản phẩm:", err);
    throw err;
  }
};


      