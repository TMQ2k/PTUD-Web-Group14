import {
    getCommentsByProductId as getCommentsByProductIdRepo,
    getParentCommentById as getParentCommentByIdRepo,
    postComment as postCommentRepo,
} from "../repo/commentRepo.js";

import {
    getSellerIdByProductId as getSellerIdByProductIdRepo,
}
from "../repo/productRepo.js";

import {
    getUserProfile as getUserProfileRepo,
}
from "../repo/userRepo.js";

import { sendNotificationEmail} from "./emailService.js";

export const getCommentsByProductId = async (productId) => {
    const comments = await getCommentsByProductIdRepo(productId);
    return comments;
}

//Người bán nhận được email thông báo về câu hỏi của người mua, trong email có kèm link mở nhanh view Xem chi tiết sản phẩm để trả lời
export const postComment = async (user, productId, content, linkProduct, parentCommentId = null) => {
    const newComment = await postCommentRepo(user.id, productId, content, parentCommentId);
    const sellerId = await getSellerIdByProductIdRepo(productId);
    const sellerProfile = await getUserProfileRepo(sellerId);

    // Send notification email to product owner
    if (parentCommentId === null) {
        const subject = "CÂU HỎI MỚI VỀ SẢN PHẨM CỦA BẠN";
        const message = "Bạn có một câu hỏi mới về sản phẩm của bạn. Nôi dung câu hỏi: " + content + "\nVui lòng bấm vào link sau để trả lời: " + linkProduct;
        await sendNotificationEmail(sellerProfile.email, subject, message);
        return newComment;
    }
    else { 
        // Send notification email to parent comment owner
        const parentComment = await getParentCommentByIdRepo(parentCommentId);
        const parentCommentOwnerProfile = await getUserProfileRepo(parentComment.user_id);
        const subject = "CÂU TRẢ LỜI MỚI CHO BÌNH LUẬN CỦA BẠN";
        const message = "Bạn có một câu trả lời mới cho bình luận của bạn. Nôi dung câu trả lời: " + content + "\nVui lòng bấm vào link sau để xem chi tiết: " + linkProduct;
        await sendNotificationEmail(parentCommentOwnerProfile.email, subject, message);
        return newComment;
    }

}