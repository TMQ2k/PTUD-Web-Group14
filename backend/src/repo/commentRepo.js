//comments(comment_id, user_id, product_id, content, created_at, parent_comment_id)
import pool from "../config/db.js";


export const getCommentsByProductId = async (productId) => {
    const result = await pool.query(
        `SELECT * FROM comments WHERE product_id = $1 ORDER BY created_at ASC`,
        [productId]
    );
    //Build comment list to have nested replies
    //Replies = [id1, id2, ...]
    const commentsList = [];
    const commentMap = new Map();
    for (const row of result.rows) {
        const comment = {
            comment_id: row.comment_id,
            user_id: row.user_id,
            content: row.content,
            created_at: row.created_at,
            parent_comment_id: row.parent_comment_id,
            replies: []
        };
        commentMap.set(comment.comment_id, comment);
        if (comment.parent_comment_id === null) {
            commentsList.push(comment);
        } else {
            const parentComment = commentMap.get(comment.parent_comment_id);
            if (parentComment) {
                parentComment.replies.push(Number(comment.comment_id));
            }
            commentsList.push(comment);
        }
    }

    return commentsList

}

export const getAllCommentersByProductId = async (productId) => {
    const result = await pool.query(  
        `SELECT DISTINCT c.user_id
        FROM comments c
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