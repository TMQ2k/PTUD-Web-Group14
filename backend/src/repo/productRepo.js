import pool from "../config/db.js";
export const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM products");
  return result.rows;
}

//Find latest products with the that are still active

export const getTopCurrentProducts = async (limit = 5) => {
    const result = await pool.query("SELECT * FROM products WHERE is_active = true ORDER BY end_time ASC LIMIT $1", [limit]);
    return result.rows.map(row => ({
        product_id: row.product_id,
        name: row.name,
        image_cover_url: row.image_cover_url,
        current_price: row.current_price,
        buy_now_price: null,
        is_active: row.is_active,
        created_at: row.created_at,
        end_time: row.end_time
    }));
}

export const getHighestPricedProducts = async (limit = 5) => {
    const result = await pool.query("SELECT * FROM products ORDER BY current_price DESC LIMIT $1", [limit]);
    return result.rows.map(row => ({
        product_id: row.product_id,
        name: row.name,
        image_cover_url: row.image_cover_url,
        current_price: row.current_price,   
        buy_now_price: null,
        is_active: row.is_active,
        created_at: row.created_at,
        end_time: row.end_time

    }));
}

export const getProductsByCategory = async (categoryId) => {
    const result = await pool.query("SELECT * FROM products, product_categories WHERE products.product_id = product_categories.product_id AND product_categories.category_id = $1", [categoryId]);
    return result.rows.map(row => ({
        product_id: row.product_id,
        name: row.name,
        image_cover_url: row.image_cover_url,
        current_price: row.current_price,
        buy_now_price: null,
        is_active: row.is_active,
        created_at: row.created_at,
        end_time: row.end_time
    }));
}
