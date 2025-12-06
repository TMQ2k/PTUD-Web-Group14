//comments(comment_id, user_id, product_id, content, created_at, parent_comment_id)
import pool from "../config/db.js";

export const getCommentsByProductId = async (productId) => {
    const result = await pool.query(
        "SELECT * FROM comments WHERE product_id = $1 and parent_comment_id IS NULL ORDER BY created_at DESC",
        [productId]
    );
    for (let row of result.rows) {
        row.replies = await getRepliesByCommentId(row.comment_id);
    }
    return result.rows;
}

export const getParentCommentById = async (commentId) => {
    const result = await pool.query(
        "SELECT * FROM comments WHERE comment_id = $1",
        [commentId]
    );
    return result.rows[0] || null;
}

export const postComment = async (userId, productId, content, parentCommentId = null) => {
    const result = await pool.query(
        `INSERT INTO comments (user_id, product_id, content, parent_comment_id)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [userId, productId, content, parentCommentId]
    );
    return result.rows[0];
}   