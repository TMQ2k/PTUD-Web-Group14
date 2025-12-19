import {
    getCommentsByProductId as getCommentsByProductIdRepo,
    getParentCommentById as getParentCommentByIdRepo,
    getAllCommentersByProductId as getAllCommentersByProductIdRepo,
    postComment as postCommentRepo,
} from "../repo/commentRepo.js";

import {
    getSellerIdByProductId as getSellerIdByProductIdRepo,
}
from "../repo/productRepo.js";

import {
    getUserProfile as getUserProfileRepo,
    getUserInfoById as getUserInfoByIdRepo,
}
from "../repo/userRepo.js";

import {
    getAllBiddersByProductId as getAllBiddersByProductIdRepo,
} from "../repo/bidderRepo.js";

import { sendNotificationEmail} from "./emailService.js";
import {Comment} from "../model/commentModel.js";

//comments(comment_id, user_id, product_id, content, created_at, parent_comment_id)

export const getCommentsByProductId = async (productId) => {
    const comments = await getCommentsByProductIdRepo(productId);
    for (const comment of comments) {
        const userInfo =  await getUserInfoByIdRepo(comment.user_id);
        if (userInfo == null) { 
            continue;
        }
        comment.username = userInfo.username;
        comment.user_avatar_url = userInfo.avatar_url;
        comment.posted_at = comment.created_at;
        comment.parent_id = comment.parent_comment_id;
      
    }

    return comments.map(comment => new Comment(
        comment.comment_id,
        comment.user_id,
        comment.username,
        comment.user_avatar_url,
        comment.content,
        comment.posted_at,
        comment.parent_id,
        comment.replies
    ));
}

//Người bán nhận được email thông báo về câu hỏi của người mua, trong email có kèm link mở nhanh view Xem chi tiết sản phẩm để trả lời
export const postComment = async (user, productId, content, linkProduct, parentCommentId = null) => {
    const newComment = await postCommentRepo(user.id, productId, content, parentCommentId);
    const sellerId = await getSellerIdByProductIdRepo(productId);
    const sellerProfile = await getUserProfileRepo(sellerId);

    //Find all bidders and commenters emails on this product except the user who just commented
    const bidders = await getAllBiddersByProductIdRepo(productId);
    const commenters = await getAllCommentersByProductIdRepo(productId);
    console.log("🔔 [Service] Commenters on product:", commenters);
    const userIdsToNotifySet = new Set();
    bidders.forEach(bidder => {
        if (bidder && bidder.user_id !== user.id) {
            userIdsToNotifySet.add(bidder.user_id);
        }
    });

    commenters.forEach(commenter => {
        if (commenter && commenter !== user.id) {
            userIdsToNotifySet.add(commenter);
        }
    });
    
    const userProfilesToNotify = await Promise.all(
        Array.from(userIdsToNotifySet).map(userId => getUserProfileRepo(userId))
    );

    //Truncate content if too long

    if (content.length > 50) {  
        content = content.substring(0, 47) + "...";
    }
    // Send notification email to product owner
    if (user.role === "bidder" && sellerProfile.email != null) {

        const subject = "CÂU HỎI MỚI VỀ SẢN PHẨM CỦA BẠN";
        const message = "Bạn có một câu hỏi mới về sản phẩm của bạn. Nội dung câu hỏi: \n" + content + "\nVui lòng bấm vào link sau để trả lời: " + linkProduct;
        await sendNotificationEmail(sellerProfile.email, subject, message);
     
    }
    else { 
        // Send notification email to all user has commented on this product and user participated in bidding
        for (const userProfile of userProfilesToNotify) {
            if (userProfile.email != null) {
                const subject = "CÂU HỎI MỚI VỀ SẢN PHẨM BẠN ĐANG THEO DÕI";
                const message = "Có một câu hỏi mới về sản phẩm bạn đang theo dõi. Nội dung câu hỏi: \n" + content + "\nVui lòng bấm vào link sau để xem chi tiết: " + linkProduct;
                await sendNotificationEmail(userProfile.email, subject, message);
            }
        }
    }

    //Change parent_comment_id to parent_id for consistency
    newComment.parent_id = newComment.parent_comment_id;
    return newComment;
}