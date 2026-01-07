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

export const getCategoriesByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT c.category_id, c.name, c.parent_id
        FROM categories c
        JOIN product_categories pc ON c.category_id = pc.category_id
        WHERE pc.product_id = $1`,
    [productId]
  );
  return result.rows;
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
export const otherProductsByCategory = async (
  categoryIds,
  excludeProductId,
  limit = 5
) => {
  const result = await pool.query(
    `SELECT DISTINCT p.*
        FROM products p
        JOIN product_categories pc ON p.product_id = pc.product_id
        WHERE pc.category_id = ANY($1)
        AND p.product_id != $2
        AND p.is_active = true
        LIMIT $3`,
    [categoryIds, excludeProductId, limit]
  );
  return result.rows;
};

export const getSearchProducts = async (
  search,
  categoryName,
  limit = 10,
  offset = 0,
  sortBy = " "
) => {
  let baseQuery = `SELECT DISTINCT p.*
    FROM products p
    LEFT JOIN product_categories pc ON p.product_id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.category_id
    WHERE 1=1`;
  const queryParams = [];
  if (search) {
    queryParams.push(`%${search}%`);
    baseQuery += ` AND p.name ILIKE $${queryParams.length}`;
  }
  if (categoryName) {
    queryParams.push(`%${categoryName}%`);
    baseQuery += ` AND c.name ILIKE $${queryParams.length}`;
  }

  if (sortBy === "price_asc") {
    baseQuery += ` ORDER BY p.current_price ASC`;
  } else if (sortBy === "price_desc") {
    baseQuery += ` ORDER BY p.current_price DESC`;
  } else baseQuery += ` ORDER BY p.end_time DESC`;
  baseQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  }`;
  queryParams.push(limit, offset);
  const result = await pool.query(baseQuery, queryParams);
  return result.rows;
};

export const getProductsList = async (
  categoryId,
  limit,
  page = 1,
  sortBy,
  is_active
) => {
  let offset = 0;
  if (page && limit) {
    offset = (page - 1) * limit;
  }
  let baseQuery = `SELECT DISTINCT p.*
    FROM products p
    LEFT JOIN product_categories pc ON p.product_id = pc.product_id
    WHERE 1=1`;
  let queryParams = [];
  if (categoryId) {
    queryParams.push(categoryId);
    baseQuery += ` AND pc.category_id = $${queryParams.length}`;
  }
  if (is_active !== undefined) {
    if (is_active == "true") {
      queryParams.push(true);
    } else {
      queryParams.push(false);
    }
    baseQuery += ` AND p.is_active = $${queryParams.length}`;
  }
  if (sortBy === "highest_price") {
    baseQuery += ` ORDER BY p.current_price DESC`;
  } else if (sortBy === "most_bidded") {
    baseQuery = `SELECT DISTINCT p.*, COUNT(ab.product_id) AS bid_count
        FROM products p
        JOIN auto_bids ab ON p.product_id = ab.product_id
        LEFT JOIN product_categories pc ON p.product_id = pc.product_id
        WHERE 1=1`;
    //Reset queryParams for this new query
    queryParams = [];
    if (categoryId) {
      queryParams.push(categoryId);
      baseQuery += ` AND pc.category_id = $${queryParams.length}`;
    }
    if (is_active !== undefined) {
      if (is_active == "true") {
        queryParams.push(true);
      } else {
        queryParams.push(false);
      }
      baseQuery += ` AND p.is_active = $${queryParams.length}`;
    }
    baseQuery += ` GROUP BY p.product_id ORDER BY bid_count DESC`;
  } else if (sortBy === "ending_soon") {
    baseQuery += ` ORDER BY p.end_time DESC`;
  }
  if (limit) {
    queryParams.push(limit, offset);
    baseQuery += ` LIMIT $${queryParams.length - 1} OFFSET $${
      queryParams.length
    }`;
  }
  const result = await pool.query(baseQuery, queryParams);
  return result.rows;
};

export const countProductsList = async (categoryId, is_active) => {
  let baseQuery = `SELECT COUNT(DISTINCT p.product_id) AS total
    FROM products p
    LEFT JOIN product_categories pc ON p.product_id = pc.product_id
    WHERE 1=1`;
  const queryParams = [];
  if (categoryId) {
    queryParams.push(categoryId);
    baseQuery += ` AND pc.category_id = $${queryParams.length}`;
  }
  if (is_active !== undefined) {
    if (is_active == "true") {
      queryParams.push(true);
    } else {
      queryParams.push(false);
    }
    baseQuery += ` AND p.is_active = $${queryParams.length}`;
  }
  const result = await pool.query(baseQuery, queryParams);
  return parseInt(result.rows[0].total, 10);
};

export const deactiveProduct = async () => {
  const productsBefore = await pool.query(
    `SELECT product_id FROM products WHERE is_active = false`
  );

  const productBeforeIds = new Set(
    productsBefore.rows.map((row) => row.product_id)
  );

  const result = await pool.query(
    `SELECT * FROM fnc_deactivate_expired_products()`
  );
  const productsAfter = await pool.query(
    `SELECT product_id FROM products WHERE is_active = false`
  );

  const newlyDeactivatedProducts = productsAfter.rows
    .map((row) => row.product_id)
    .filter((id) => !productBeforeIds.has(id));

  return newlyDeactivatedProducts;
};

export const postProduct = async (
  seller_id,
  name,
  description,
  starting_price,
  step_price,
  buy_now_price,
  image_cover_url,
  end_time,
  extra_image_url,
  category_ids
) => {
  const result = await pool.query(
    `SELECT * FROM fnc_create_product($1, $2, $3, $4, $5, $6, $7, $8) AS product_id`,
    [
      seller_id,
      name,
      description,
      starting_price,
      step_price,
      buy_now_price,
      image_cover_url,
      end_time,
    ]
  );
  const productId = result.rows[0].product_id;
  if (extra_image_url && extra_image_url.length > 0) {
    await pool.query(`SELECT fnc_product_extra_images($1, $2)`, [
      productId,
      extra_image_url,
    ]);
  }

  if (category_ids && category_ids.length > 0) {
    await pool.query(
      `SELECT fnc_product_categories($1, $2) AS number_of_categories`,
      [productId, category_ids]
    );
  }

  return productId;
};

export const getProductListByQuery = async (
  query,
  limit = 5,
  page = 1,
  sortBy = "endtime_desc",
  is_active
) => {
  let offset = 0;
  if (page && limit) {
    offset = (page - 1) * limit;
  }
  //Search products by name or category name or category parent name and remove duplicates id
  let baseQuery = `SELECT DISTINCT p.*
    FROM products p
    LEFT JOIN product_categories pc ON p.product_id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.category_id
    WHERE (p.name ILIKE $1 OR c.name ILIKE $1 OR c.parent_id IN (
      SELECT category_id FROM categories WHERE name ILIKE $1
    ))`;
  const queryParams = [`%${query}%`];
  if (is_active !== undefined) {
    if (is_active == "true") {
      queryParams.push(true);
    } else {
      queryParams.push(false);
    }
    baseQuery += ` AND p.is_active = $${queryParams.length}`;
  }
  if (sortBy === "price_asc") {
    baseQuery += ` ORDER BY p.current_price ASC`;
  } else if (sortBy === "endtime_desc") {
    baseQuery += ` ORDER BY p.end_time DESC`;
  }
  baseQuery += ` LIMIT $2 OFFSET $3`;
  queryParams.push(limit, offset);
  const result = await pool.query(baseQuery, queryParams);
  return result.rows;
};

export const countProductsByQuery = async (query, is_active) => {
  let baseQuery = `SELECT COUNT(DISTINCT p.product_id) AS total
    FROM products p
    LEFT JOIN product_categories pc ON p.product_id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.category_id
    WHERE (p.name ILIKE $1 OR c.name ILIKE $1 OR c.parent_id IN (
      SELECT category_id FROM categories WHERE name ILIKE $1
    ))`;
  const queryParams = [`%${query}%`];
  if (is_active !== undefined) {
    if (is_active == "true") {
      queryParams.push(true);
    } else {
      queryParams.push(false);
    }
    baseQuery += ` AND p.is_active = $${queryParams.length}`;
  }
  const result = await pool.query(baseQuery, queryParams);
  return parseInt(result.rows[0].total, 10);
};

export const updateDescription = async (productId, newDescription) => {
  const result = await pool.query(
    `UPDATE products SET description = $1 WHERE product_id = $2 RETURNING *`,
    [newDescription, productId]
  );
  return result.rows[0].description;
};

export const getProductProfile = async (productId) => {
  const result = await pool.query(
    `SELECT * FROM products WHERE product_id = $1`,
    [productId]
  );
  return result.rows[0];
};

export const getRecentlyEndedProducts = async () => {
  const result = await pool.query(
    `SELECT * FROM products WHERE is_active = true AND end_time <= NOW()`
  );
  return result.rows;
};

export const getProductBySellerIdRepo = async (sellerId) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE seller_id = $1 AND is_active = true",
    [sellerId]
  );
  return result.rows;
};
export const getWinningBidderByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT user_id FROM user_won_products WHERE product_id = $1`,
    [productId]
  );
  return result.rows[0]?.user_id || null;
};

export const deactiveProductById = async (productId) => {
  const result = await pool.query(
    `UPDATE products SET end_time = NOW(), is_active = FALSE WHERE product_id = $1 RETURNING *`,
    [productId]
  );
  return result.rows[0];
};

export const updateCurrentPrice = async (productId, newPrice) => {
  const result = await pool.query(
    `UPDATE products SET current_price = $1 WHERE product_id = $2 RETURNING *`,
    [newPrice, productId]
  );
  return result.rows[0];
};

export const bannedListProductRepo = async (productId) => {
  const result = await pool.query(`select * from fnc_banned_in_product($1)`, [
    productId,
  ]);
  return result.rows;
};

export const enableExtentionForProductRepo = async (sellerId, productId) => {
  const result = await pool.query(
    `select * from fnc_enable_auction_extension( $1, $2 )`,
    [sellerId, productId]
  );
  return result.rows[0];
};
export const getProdudctsListByBidderId = async (
  bidderId,
  limit,
  page,
  is_active
) => {
  let offset = 0;
  if (page && limit) {
    offset = (page - 1) * limit;
  }
  let baseQuery = `SELECT DISTINCT p.*
    FROM products p
    LEFT JOIN auto_bids ab ON p.product_id = ab.product_id
    WHERE ab.user_id = $1`;
  const queryParams = [bidderId];
  if (is_active !== undefined) {
    if (String(is_active) == "true") {
      queryParams.push(true);
    } else {
      queryParams.push(false);
    }
    baseQuery += ` AND p.is_active = $${queryParams.length}`;
  }
  baseQuery += ` ORDER BY p.end_time ASC`;
  if (limit) {
    queryParams.push(limit, offset);
    baseQuery += ` LIMIT $${queryParams.length - 1} OFFSET $${
      queryParams.length
    }`;
  }
  const result = await pool.query(baseQuery, queryParams);
  return result.rows;
};

export const countProductsByBidderId = async (bidderId, is_active) => {
  let baseQuery = `SELECT COUNT(DISTINCT p.product_id) AS total
    FROM products p
    LEFT JOIN auto_bids ab ON p.product_id = ab.product_id
    WHERE ab.user_id = $1`;
  const queryParams = [bidderId];
  if (is_active !== undefined) {
    if (String(is_active) == "true") {
      queryParams.push(true);
    } else {
      queryParams.push(false);
    }
    baseQuery += ` AND p.is_active = $${queryParams.length}`;
  }
  const result = await pool.query(baseQuery, queryParams);
  return parseInt(result.rows[0].total, 10);
};
