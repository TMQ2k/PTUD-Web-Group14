import pool from "../config/db.js";
export const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM products");
  return result.rows;
};

//Find latest products with the that are still active

export const getTopCurrentProducts = async (limit = 5) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE is_active = true ORDER BY end_time ASC LIMIT $1",
    [limit]
  );
  return result.rows.map((row) => ({
    product_id: row.product_id,
    name: row.name,
    image_cover_url: row.image_cover_url,
    current_price: row.current_price,
    buy_now_price: null,
    is_active: row.is_active,
    created_at: row.created_at,
    end_time: row.end_time,
  }));
};

export const getHighestPricedProducts = async (limit = 5) => {
  const result = await pool.query(
    "SELECT * FROM products ORDER BY current_price DESC LIMIT $1",
    [limit]
  );
  return result.rows.map((row) => ({
    product_id: row.product_id,
    name: row.name,
    image_cover_url: row.image_cover_url,
    current_price: row.current_price,
    buy_now_price: null,
    is_active: row.is_active,
    created_at: row.created_at,
    end_time: row.end_time,
  }));
};

export const getMostBiddedProducts = async (limit = 5) => {
  const result = await pool.query(
    `
        SELECT p.*, COUNT(ab.product_id) AS bid_count
        FROM products p
        JOIN auto_bids ab ON p.product_id = ab.product_id
        GROUP BY p.product_id
        ORDER BY bid_count DESC
        LIMIT $1    
    `,
    [limit]
  );

  return result.rows.map((row) => ({
    product_id: row.product_id,
    name: row.name,
    image_cover_url: row.image_cover_url,
    current_price: row.current_price,
    buy_now_price: null,
    is_active: row.is_active,
    created_at: row.created_at,
    end_time: row.end_time,
    bid_count: row.bid_count,
  }));
};

export const getProductsByCategory = async (categoryId) => {
  const result = await pool.query(
    "SELECT * FROM products, product_categories WHERE products.product_id = product_categories.product_id AND product_categories.category_id = $1",
    [categoryId]
  );
  return result.rows.map((row) => ({
    product_id: row.product_id,
    name: row.name,
    image_cover_url: row.image_cover_url,
    current_price: row.current_price,
    buy_now_price: null,
    is_active: row.is_active,
    created_at: row.created_at,
    end_time: row.end_time,
  }));
};

export const getProductImages = async (productId) => {
  const result = await pool.query(
    "SELECT image_url FROM product_images WHERE product_id = $1",
    [productId]
  );
  return result.rows.map((row) => row.image_url);
};

export const getProductBaseInfoById = async (productId) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [productId]
  );
  return result.rows[0] || null;
};

export const getSellerIdByProductId = async (productId) => {
  const result = await pool.query(
    "SELECT seller_id FROM products WHERE product_id = $1",
    [productId]
  );
  return result.rows[0]?.seller_id || null;
};

export const getProductBidHistory = async (productId) => {
  const result = await pool.query(
    `
        SELECT * FROM fnc_history_bids_product($1)
    `,
    [productId]
  );
  return result.rows;
};
