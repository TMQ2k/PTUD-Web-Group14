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
} from "../repo/bidderRepo.js";

import {
  getUserInfoById,
}
from "../repo/userRepo.js";

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
    console.error("❌ [Service] Lỗi khi lấy tất cả bidder theo productId:", err);
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
    return watchlist;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi lấy watchlist của user:", err);
    throw err;
  }
};

export const upsertAutoBidService = async (userId, productId, maxBidAmount) => {
  try {
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
