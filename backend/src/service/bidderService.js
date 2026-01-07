import {
  addItemToWatchlist,
  removeItemFromWatchlist,
  getAllBiddersByProductId,
  getUserWatchlist,
  upsertAutoBid,
  updateAutoBidCurrentAmount,
  requestUpgradeToSeller,
  getUpgradeRequests,
  handleUpgradeRequest,
  requestBidderOnProductRepo,
  isBidsOnProductRepo,
  getTopBidderIdByProductId,
} from "../repo/bidderRepo.js";

import { getUserInfoById, getUserProfile } from "../repo/userRepo.js";

import { sendNotificationEmail } from "./emailService.js";

import { getProductProfile } from "../repo/productRepo.js";

export const addProductToWatchlist = async (userId, productId) => {
  try {
    const watchlistEntry = await addItemToWatchlist(userId, productId);
    return watchlistEntry;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi thêm sản phẩm vào watchlist:", err);
    throw err;
  }
};

export const getAllBidderInfosByProductId = async (productId) => {
  try {
    const bidders = await getAllBiddersByProductId(productId);
    for (let bidder of bidders) {
      const userInfo = await getUserInfoById(bidder.user_id);
      bidder.username = userInfo.username;
      bidder.avatar_url = userInfo.avatar_url;
      bidder.points = userInfo.points;
    }
    return bidders;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi lấy tất cả bidder theo productId:",
      err
    );
    throw err;
  }
};

export const removeProductFromWatchlist = async (userId, productId) => {
  try {
    const watchlistEntry = await removeItemFromWatchlist(userId, productId);
    return watchlistEntry;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi xóa sản phẩm khỏi watchlist:", err);
    throw err;
  }
};

export const getUserWatchlistService = async (userId) => {
  try {
    const watchlist = await getUserWatchlist(userId);

    return watchlist.map((item) => ({
      watch_id: item.watch_id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_description: item.product_description,
      image_cover_url: item.image_cover_url,
      current_price: parseFloat(item.current_price),
      buy_now_price: parseFloat(item.buy_now_price),
      is_active: item.is_active,
      product_end_time: item.product_end_time,
      watch_created_at: item.watch_created_at,
      product_created_at: item.product_created_at,
      history_count: parseInt(item.history_count, 10),

      top_bidder: item.winner_id
        ? {
            id: item.winner_id,
            username: item.winner_username,
            avatar_url: item.winner_avatar_url,
            points: parseFloat(item.winner_points),
          }
        : null,
    }));
  } catch (err) {
    console.error("❌ [Service] Lỗi khi lấy watchlist của user:", err);
    throw err;
  }
};

export const upsertAutoBidService = async (
  userId,
  productId,
  maxBidAmount,
  linkProduct
) => {
  try {
    //Send notification email to bidder, seller, top bidder
    const bidderProfile = await getUserProfile(userId);
    const productProfile = await getProductProfile(productId);
    const sellerProfile = await getUserProfile(productProfile.seller_id);
    if (bidderProfile && productProfile && sellerProfile) {
      await sendBidNotificationEmailForBidders(
        bidderProfile.email,
        productProfile.name
      );
      await sendBidNotificationEmailForSellers(
        sellerProfile.email,
        productProfile.name
      );
    }

    const topBidderId = await getTopBidderIdByProductId(productId);
    if (topBidderId && topBidderId !== userId) {
      const topBidderProfile = await getUserProfile(topBidderId);
      if (topBidderProfile) {
        await sendBidNotificationEmailForTopBidder(
          topBidderProfile.email,
          productProfile.name,
          linkProduct
        );
      }
    }

    const autoBidEntry = await upsertAutoBid(userId, productId, maxBidAmount);
    return autoBidEntry;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi thêm/cập nhật auto bid:", err);
    throw err;
  }
};

export const updateAutoBidCurrentAmountService = async (productId) => {
  try {
    const updatedBids = await updateAutoBidCurrentAmount(productId);
    return updatedBids;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi cập nhật current bid amount:", err);
    throw err;
  }
};

export const requestUpgradeToSellerService = async (userId) => {
  try {
    const result = await requestUpgradeToSeller(userId);
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi yêu cầu nâng cấp lên seller:", err);
    throw err;
  }
};

export const getUpgradeRequestsService = async () => {
  try {
    const requests = await getUpgradeRequests();
    return requests;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi lấy các yêu cầu nâng cấp:", err);
    throw err;
  }
};

export const handleUpgradeRequestService = async (userId, approve) => {
  try {
    const result = await handleUpgradeRequest(userId, approve);
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi xử lý yêu cầu nâng cấp:", err);
    throw err;
  }
};

export const requestBidderOnProductService = async (
  productId,
  bidderId,
  reason
) => {
  try {
    const result = await requestBidderOnProductRepo(
      productId,
      bidderId,
      reason
    );
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi yêu cầu đấu thầu sản phẩm:", err);
    throw err;
  }
};

export const isBidsOnProductService = async (productId, bidderId) => {
  try {
    const result = await isBidsOnProductRepo(productId, bidderId);
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi kiểm tra đấu thầu trên sản phẩm:", err);
    throw err;
  }
};

export const sendBidNotificationEmailForSellers = async (
  sellerEmail,
  productName
) => {
  const subject = "THÔNG BÁO VỀ ĐẤU GIÁ SẢN PHẨM CỦA BẠN";
  const message = `Sản phẩm "${productName}" của bạn đã có thêm người đấu giá. Vui lòng đăng nhập để kiểm tra.`;
  try {
    await sendNotificationEmail(sellerEmail, subject, message);
  } catch (err) {
    console.error("❌ [Service] Lỗi khi gửi email thông báo đấu giá:", err);
    throw err;
  }
};

export const sendBidNotificationEmailForBidders = async (
  bidderEmail,
  productName
) => {
  const subject = "THÔNG BÁO VỀ ĐẤU GIÁ SẢN PHẨM BẠN ĐÃ ĐẤU GIÁ";
  const message = `Bạn đã tham gia đấu giá sản phẩm "${productName}" thành công. Vui lòng đăng nhập để kiểm tra.`;
  try {
    await sendNotificationEmail(bidderEmail, subject, message);
  } catch (err) {
    console.error("❌ [Service] Lỗi khi gửi email thông báo đấu giá:", err);
    throw err;
  }
};

export const sendBidNotificationEmailForTopBidder = async (
  topBidderEmail,
  productName,
  linkProduct
) => {
  const subject = "THÔNG BÁO VỀ ĐẤU GIÁ SẢN PHẨM BẠN ĐÃ ĐẤU GIÁ";
  const message = `Bạn đã bị vượt qua trong đấu giá sản phẩm "${productName}". Vui lòng đăng nhập để kiểm tra và đặt giá cao hơn nếu bạn muốn tiếp tục tham gia đấu giá. Xem chi tiết tại: ${linkProduct}`;
  try {
    await sendNotificationEmail(topBidderEmail, subject, message);
  } catch (err) {
    console.error("❌ [Service] Lỗi khi gửi email thông báo đấu giá:", err);
    throw err;
  }
};
