import { http } from "../libs/http";

const productEndpoint = {
  getAll: "/products",
  getTop5HighestPrice: "/products/highest-priced/5",
  getTop5EndingSoon: "/products/top-current/5",
  getByCategory: (categoryId) => `/products/${categoryId}`,
};

export const productApi = {
  /**
   * Lấy top 5 sản phẩm có giá cao nhất
   * @returns {Promise<Array>} Mảng sản phẩm
   */
  getTop5HighestPrice: async () => {
    const response = await http.get(productEndpoint.getTop5HighestPrice);
    return response.data;
  },

  /**
   * Lấy top 5 sản phẩm gần kết thúc nhất
   * @returns {Promise<Array>} Mảng sản phẩm
   */
  getTop5EndingSoon: async () => {
    const response = await http.get(productEndpoint.getTop5EndingSoon);
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm theo category
   * @param {number} categoryId - ID của category
   * @returns {Promise<Array>} Mảng sản phẩm
   */
  getProductsByCategory: async (categoryId) => {
    const response = await http.get(productEndpoint.getByCategory(categoryId));
    return response.data;
  },
};
