import express, {json} from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { getCommentsByProductId, postComment } from "../service/commentService.js";
const router = express.Router();
router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const comments = await getCommentsByProductId(productId);   
        res.json({
            code: 200,
            message: 'Comments retrieved successfully',
            data: comments
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: 'Failed to retrieve comments',
            error: error.message
        });
    }
});

router.post('/:productId', authenticate, authorize(["bidder", "seller"]), async (req, res) => {
    try {
        const user = req.user;
        const productId = req.params.productId;
        const { content, link_product, parent_comment_id } = req.body;
        const newComment = await postComment(user, productId, content, link_product, parent_comment_id);
        res.json({
            code: 201,
            message: 'Comment posted successfully',
            data: newComment
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Failed to post comment',
            error: error.message
        });
    }
});

export default router;