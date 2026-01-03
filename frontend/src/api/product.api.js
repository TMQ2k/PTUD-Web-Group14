import { http } from "../libs/http";
import { authStorage } from "../utils/auth";

const productEndpoint = {
  getAll: "/products",
  postProduct: "/products",
  productBiddingHistory: "/products/bid-history",
  winningBidder: "/winning-bidder",
  enableExtension: "/products/enable-extension",
  deactivateExpired: "/products/deactivate-expired",
  sellerProducts: "/products/seller-products",
  search: "search/products",
};

export const productApi = {
  /**
   * Lấy danh sách sản phẩm với các filter
   * @param {Object} params - Query parameters
   * @param {number} params.categoryId - ID của category
   * @param {string} params.sortBy - Sắp xếp: 'highest_price', 'most_bidded', 'ending_soon' (default)
   * @param {number} params.limit - Số lượng sản phẩm trả về
   * @param {number} params.page - Trang hiện tại
   * @param {boolean} params.is_active - true: active, false: hết hạn, undefined: cả hai
   * @returns {Promise<Object>} Response chứa data
   */
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.categoryId) queryParams.append("categoryId", params.categoryId);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.page) queryParams.append("page", params.page);
    if (params.is_active !== undefined)
      queryParams.append("is_active", params.is_active);

    const url = `${productEndpoint.getAll}?${queryParams.toString()}`;
    const response = await http.get(url);
    return response.data;
  },

  /**
   * Lấy top 5 sản phẩm có giá cao nhất
   * @returns {Promise<Array>} Mảng sản phẩm
   */
  getTop5HighestPrice: async () => {
    const response = await http.get(
      // `${productEndpoint.getAll}?limit=5&page=1&sortBy=highest_price`
      `${productEndpoint.getAll}?limit=5&page=1&sortBy=highest_price&is_active=true`
    );
    return response.data;
  },

  /**
   * Lấy top 5 sản phẩm gần kết thúc nhất
   * @returns {Promise<Array>} Mảng sản phẩm
   */
  getTop5EndingSoon: async () => {
    const response = await http.get(
      // `${productEndpoint.getAll}?limit=5&page=1&sortBy=ending_soon`
      `${productEndpoint.getAll}?limit=5&page=1&sortBy=ending_soon&is_active=true`
    );
    return response.data;
  },

  /**
   * Lấy top 5 sản phẩm có nhiều lượt ra giá nhất
   * @returns {Promise<Array>} Mảng sản phẩm
   */
  getTop5MostBidded: async () => {
    const response = await http.get(
      // `${productEndpoint.getAll}?limit=5&page=1&sortBy=most_bidded`
      `${productEndpoint.getAll}?limit=5&page=1&sortBy=most_bidded&is_active=true`
    );
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm theo category
   * @param {number} categoryId - ID của category
   * @returns {Promise<Array>} Mảng sản phẩm
   */
  getProductsByCategory: async (categoryId) => {
    const response = await http.get(
      `${productEndpoint.getAll}?categoryId=${categoryId}`
    );
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await http.get(
      `${productEndpoint.getAll}/${productId}`
    );
    return response.data;
  },

  postProduct: async (productFormData) => {
    const respone = await http.post(
      `${productEndpoint.postProduct}`,
      productFormData,
      {
        headers: {
          Authorization: `Bearer ${authStorage.getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return respone.data;
  },

  /**
   * Hủy kích hoạt các sản phẩm đã hết hạn đấu giá
   * @returns {Promise<Object>} Response từ server
   */
  deactivateExpiredProducts: async () => {
    const response = await http.put(productEndpoint.deactivateExpired);
    return response.data;
  },

  /**
   * Tìm kiếm sản phẩm với full-text search
   * @param {Object} params - Query parameters
   * @param {string} params.q - Từ khóa tìm kiếm (tên sản phẩm)
   * @param {number} params.limit - Số lượng sản phẩm mỗi trang (default: 8)
   * @param {number} params.page - Trang hiện tại (default: 1)
   * @param {string} params.sortBy - Sắp xếp: 'price_asc' | 'endtime_desc' (default)
   * @param {boolean} params.is_active - true: active, false: hết hạn, undefined: cả hai
   * @returns {Promise<Object>} Response chứa data
   */
  searchProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.page) queryParams.append("page", params.page);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.is_active !== undefined)
      queryParams.append("is_active", params.is_active);

    const url = `${productEndpoint.search}?${queryParams.toString()}`;
    const response = await http.get(url);
    return response.data;
  },

  getProductBiddingHistory: async (productId) => {
    const respone = await http.get(
      `${productEndpoint.productBiddingHistory}/${productId}`
    );
    return respone.data;
  },

  updateDescription: async (productId, updatedDescription) => {
    // console.log(updatedDescription);
    // console.log(JSON.stringify(updatedDescription))
    const respone = await http.put(
      `products/${productId}/description`,
      { newDescription: updatedDescription },
      {
        headers: {
          Authorization: `Bearer ${authStorage.getToken()}`,
        },
      }
    );
    return respone.data;
  },

  getWinningBidder: async (productId) => {
    const respone = await http.get(`/products/${productId}${productEndpoint.winningBidder}`);
    return respone.data;
  },

  enableProductExtension: async (productId) => {
    const respone = await http.post(productEndpoint.enableExtension, {
      productId: productId,
    }, {});

    return respone.data;
  },

  getSellerProducts: async () => {
    const respone = await http.get(productEndpoint.sellerProducts);
    return respone.data;
  }
};
