//comments(comment_id, user_id, product_id, content, created_at, parent_comment_id)
import pool from "../config/db.js";

export const getCommentsByProductId = async (productId) => {
    const result = await pool.query(
        "SELECT * FROM comments WHERE product_id = $1 ORDER BY created_at DESC",
        [productId]
    );
    for (const row of result.rows) {
        const repliesResult = await pool.query(
            "SELECT comment_id FROM comments WHERE parent_comment_id = $1 ORDER BY created_at DESC",
            [row.comment_id]
        );
        row.replies = repliesResult.rows.map(r => r.comment_id);
    }
    return result.rows;
}

export const getAllCommentersByProductId = async (productId) => {
    const result = await pool.query(
        `SELECT DISTINCT u.user_id
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.product_id = $1`,
        [productId]
    );
    return result.rows.map(row => row.user_id);
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