import {
  addItemToWatchlist,
  removeItemFromWatchlist,
  getUserWatchlist,
  upsertAutoBid,
  updateAutoBidCurrentAmount,
} from "../repo/bidderRepo.js";

export const addProductToWatchlist = async (userId, productId) => {
  try {
    const watchlistEntry = await addItemToWatchlist(userId, productId);
    return watchlistEntry;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi thêm sản phẩm vào watchlist:", err);
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
