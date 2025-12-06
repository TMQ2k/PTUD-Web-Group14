import { http } from "../libs/http";

const productEndpoint = {
  getAll: "/products",
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
      `${productEndpoint.getAll}?limit=5&page=1&sortBy=highest_price`
    );
    return response.data;
  },

  /**
   * Lấy top 5 sản phẩm gần kết thúc nhất
   * @returns {Promise<Array>} Mảng sản phẩm
   */
  getTop5EndingSoon: async () => {
    const response = await http.get(
      `${productEndpoint.getAll}?limit=5&page=1&sortBy=ending_soon`
    );
    return response.data;
  },

  /**
   * Lấy top 5 sản phẩm có nhiều lượt ra giá nhất
   * @returns {Promise<Array>} Mảng sản phẩm
   */
  getTop5MostBidded: async () => {
    const response = await http.get(
      `${productEndpoint.getAll}?limit=5&page=1&sortBy=most_bidded`
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
      `${productEndpoint.getAll}?/${productId}`
    )
    return response.data;
  }
};
