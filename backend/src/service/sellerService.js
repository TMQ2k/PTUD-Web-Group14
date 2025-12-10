import {
  deactivateAllSellerExpiredRepo,
  getSellerStartTimeRepo,
  sellerRejectBidderRepo,
  sellerJudgeBidderRepo,
  sellerDeleteBannedBidderRepo,
  sellerAllowBidderRepo,
  getAllRequestsRepo,
  enableAuctionExtensionRepo,
} from "../repo/sellerRepo.js";

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
    return result;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi người bán từ chối người đấu thầu:",
      err
    );
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
