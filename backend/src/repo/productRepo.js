import pool from "../config/db.js";

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

export const deleteProductById = async (productId) => {
  const result = await pool.query("SELECT * FROM fnc_delete_product($1)", [
    productId,
  ]);
  return result.rows[0];
};
export const otherProductsByCategory = async (
  categoryId,
  excludeProductId,
  limit = 5
) => {
  const result = await pool.query(
    `SELECT p.*
        FROM products p
        JOIN product_categories pc ON p.product_id = pc.product_id
        WHERE pc.category_id = $1 AND p.product_id != $2
        LIMIT $3
        `,
    [categoryId, excludeProductId, limit]
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
  let baseQuery = `SELECT p.*
    FROM products p
    LEFT JOIN product_categories pc ON p.product_id = pc.product_id
    WHERE 1=1`;
  const queryParams = [];
  if (categoryId) {
    queryParams.push(categoryId);
    baseQuery += ` AND pc.category_id = $${queryParams.length}`;
  }
  if (sortBy === "highest_price") {
    baseQuery += ` ORDER BY p.current_price DESC`;
  } else if (sortBy === "most_bidded") {
    baseQuery = `SELECT p.*, COUNT(ab.product_id) AS bid_count
        FROM products p
        JOIN auto_bids ab ON p.product_id = ab.product_id
        LEFT JOIN product_categories pc ON p.product_id = pc.product_id
        WHERE 1=1`;
    if (categoryId) {
      queryParams.push(categoryId);
      baseQuery += ` AND pc.category_id = $${queryParams.length}`;
    }
    baseQuery += ` GROUP BY p.product_id ORDER BY bid_count DESC`;
  } else if (sortBy === "ending_soon") {
    baseQuery += ` ORDER BY p.end_time ASC`;
  }
  if (limit) {
    queryParams.push(limit, offset);
    baseQuery += ` LIMIT $${queryParams.length - 1} OFFSET $${
      queryParams.length
    }`;
  }
  if (is_active !== undefined) {
    queryParams.push(is_active);
    baseQuery += ` AND p.is_active = $${queryParams.length}`;
  }
  const result = await pool.query(baseQuery, queryParams);
  return result.rows;
};
/*
fnc_create_product
(
    p_seller_id INTEGER,
    p_name VARCHAR,
    p_description TEXT,
    p_starting_price NUMERIC(15,2),
    p_step_price NUMERIC(15,2),
    p_buy_now_price NUMERIC(15, 2),
    p_image_cover_url TEXT,
    p_end_time TIMESTAMP
)

fnc_product_extra_images(
    _product_id INTEGER,
    _image_urls TEXT[]
)


*/
export const postProduct = async (
  seller_id,
  name,
  description,
  starting_price,
  step_price,
  buy_now_price,
  image_cover_url,
  end_time,
  extra_image_url
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
  return result.rows[0].product;
};
