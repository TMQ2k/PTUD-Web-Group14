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

export const sellerRejectBidderRepo = async (
  productId,
  sellerId,
  bidderId,
  reason
) => {
  const result = await pool.query(
    "SELECT * FROM fnc_seller_rejects_bidder_on_product($1, $2, $3, $4)",
    [productId, sellerId, bidderId, reason]
  );
  return result.rows[0];
};

export const sellerJudgeBidderRepo = async (sellerId, bidderId, value) => {
  const result = await pool.query(
    "SELECT * FROM fnc_judge_bidder($1, $2, $3)",
    [sellerId, bidderId, value]
  );
  return result.rows[0];
};

export const sellerDeleteBannedBidderRepo = async (
  productId,
  sellerId,
  bidderId
) => {
  const result = await pool.query(
    "SELECT * FROM fnc_delete_rejection($1, $2, $3)",
    [productId, sellerId, bidderId]
  );
  return result.rows[0];
};

export const sellerAllowBidderRepo = async (productId, sellerId, bidderId) => {
  const result = await pool.query(
    "SELECT * FROM fnc_seller_allows_bidder_on_product($1, $2, $3)",
    [productId, sellerId, bidderId]
  );
  return result.rows[0];
};

export const getAllRequestsRepo = async (sellerId, productId) => {
  const result = await pool.query(
    `SELECT * FROM fnc_get_requests_by_seller_product($1, $2)`,
    [sellerId, productId]
  );
  const getNameOfProduct = await pool.query(
    `SELECT name FROM products WHERE product_id = $1`,
    [productId]
  );
  return {
    productId: productId,
    productName: getNameOfProduct.rows[0].name,
    requests: result.rows,
  };
};

export const enableAuctionExtensionRepo = async (sellerId, productId) => {
  const result = await pool.query(
    `SELECT * FROM fnc_enable_auction_extension($1, $2)`,
    [sellerId, productId]
  );
  return result.rows[0];
};
