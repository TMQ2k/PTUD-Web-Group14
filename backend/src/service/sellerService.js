import {
  deactivateAllSellerExpiredRepo,
  getSellerStartTimeRepo,
  sellerRejectBidderRepo,
  sellerDeleteBannedBidderRepo,
  sellerAllowBidderRepo,
  getAllRequestsRepo,
  enableAuctionExtensionRepo,
} from "../repo/sellerRepo.js";

import { getUserProfile } from "../repo/userRepo.js";
import { getProductProfile } from "./productService.js";
import {
  sendNotificationEmail
} from "./emailService.js";

export const deactivateAllSellerExpiredService = async () => {
  try {
    const result = await deactivateAllSellerExpiredRepo();
    return result;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi vô hiệu hóa tất cả người bán hết hạn:",
      err
    );
    throw err;
  }
};

export const getSellerStartTimeService = async (sellerId) => {
  try {
    const result = await getSellerStartTimeRepo(sellerId);
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi lấy thời gian bắt đầu người bán:", err);
    throw err;
  }
};

export const sellerRejectBidderService = async (
  productId,
  sellerId,
  bidderId,
  reason
) => {
  try {
    const result = await sellerRejectBidderRepo(
      productId,
      sellerId,
      bidderId,
      reason
    );

    const bidderProfile = await getUserProfile(bidderId);
    const sellerProfile = await getUserProfile(sellerId);
    const productProfile = await getProductProfile(productId);
    if (bidderProfile && sellerProfile) {
      await sendEmailRejectBidderService(
        bidderProfile.email,
        bidderProfile.username,
        sellerProfile.username,
        productProfile.name,
        reason
      );
    }

    return result;
    
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi người bán từ chối người đấu thầu:",
      err
    );
    throw err;
  }
};

export const sendEmailRejectBidderService = async (to, bidderName, sellerName, productName, reason) => {
  try {
    const subject = `Thông báo từ web đấu giá - Yêu cầu ra giá bị từ chối`;
    const message = `Xin chào ${bidderName},\n\nChúng tôi rất tiếc thông báo rằng yêu cầu ra giá của bạn cho sản phẩm "${productName}" đã bị từ chối vì lý do sau: ${reason}.\n\nCảm ơn bạn đã quan tâm đến sản phẩm của chúng tôi. Hy vọng sẽ được phục vụ bạn trong tương lai.\n\nTrân trọng,\n${sellerName} và đội ngũ web đấu giá.`;
    await sendNotificationEmail(to, subject, message);
  } catch (err) {
    console.error("❌ [Service] Lỗi khi gửi email từ chối người đấu thầu:", err);
    throw err;
  }
};

export const sellerJudgeBidderService = async (sellerId, bidderId, value) => {
  try {
    const result = await sellerJudgeBidderRepo(sellerId, bidderId, value);
    return result;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi người bán đánh giá người đấu thầu:",
      err
    );
    throw err;
  }
};

export const sellerDeleteBannedBidderService = async (
  productId,
  sellerId,
  bidderId
) => {
  try {
    const result = await sellerDeleteBannedBidderRepo(
      productId,
      sellerId,
      bidderId
    );
    return result;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi người bán xóa người đấu thầu bị cấm:",
      err
    );
    throw err;
  }
};

export const sellerAllowBidderService = async (
  productId,
  sellerId,
  bidderId
) => {
  try {
    const result = await sellerAllowBidderRepo(productId, sellerId, bidderId);
    return result;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi người bán cho phép người đấu thầu:",
      err
    );
    throw err;
  }
};

export const getAllRequestsService = async (sellerId, productId) => {
  try {
    const result = await getAllRequestsRepo(sellerId, productId);
    return result;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi lấy tất cả yêu cầu của người bán:",
      err
    );
    throw err;
  }
};

export const enableAuctionExtensionService = async (sellerId, productId) => {
  try {
    const result = await enableAuctionExtensionRepo(sellerId, productId);
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi kích hoạt gia hạn đấu giá:", err);
    throw err;
  }
};
