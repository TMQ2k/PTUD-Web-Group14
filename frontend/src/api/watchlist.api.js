import { http } from "../libs/http";

const watchlistEndpoint = {
  getAll: "/bidder/watchlist",
  add: "/bidder/add-to-watchlist",
  remove: "/bidder/remove-from-watchlist",
};

export const watchlistApi = {
  /**
   * Lấy danh sách sản phẩm yêu thích của user
   * @returns {Promise<Object>} Response chứa danh sách watchlist
   */
  getWatchlist: async () => {
    const response = await http.get(watchlistEndpoint.getAll);
    return response.data;
  },

  /**
   * Thêm sản phẩm vào watchlist
   * @param {number} productId - ID sản phẩm
   * @returns {Promise<Object>} Response chứa watchlist entry
   */
  addToWatchlist: async (productId) => {
    const response = await http.post(watchlistEndpoint.add, { productId });
    return response.data;
  },

  /**
   * Xóa sản phẩm khỏi watchlist
   * @param {number} productId - ID sản phẩm
   * @returns {Promise<Object>} Response xác nhận xóa
   */
  removeFromWatchlist: async (productId) => {
    const response = await http.delete(watchlistEndpoint.remove, {
      data: { productId },
    });
    return response.data;
  },
};
