import { http } from "../libs/http";

const productEndpoint = {
  getAll: "/products",
  postProduct: "/products",
<<<<<<< HEAD
  productBiddingHistory: "/products/bid-history"
=======
  deactivateExpired: "/products/deactivate-expired",
  search: "/search/products",
>>>>>>> 4546f07cc1a38fb3c1cbf9c200cb0f39a3c65afd
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

  getProductById: async (productId, other_products_quantity) => {
    const response = await http.get(
      `${productEndpoint.getAll}/${productId}?limit=${other_products_quantity}`
    );
    return response.data;
  },

  postProduct: async (productFormData) => {
<<<<<<< HEAD
    await http.post(
      `${productEndpoint.postProduct}`, {
        productFormData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },      
      }
    );
  },

  getProductBiddingHistory: async (product_id) => {
    const respone = await http.get(`${productEndpoint.productBiddingHistory}/${product_id}`);
    return respone.data;
  }
=======
    await http.post(`${productEndpoint.postProduct}`, {
      productFormData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
>>>>>>> 4546f07cc1a38fb3c1cbf9c200cb0f39a3c65afd
};
