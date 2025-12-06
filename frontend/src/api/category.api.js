import { http } from "../libs/http";

const categoryEndpoint = {
  getAll: "/categories",
  getById: (categoryId) => `/categories/${categoryId}`,
};

export const categoryApi = {
  /**
   * Lấy tất cả categories (với children)
   * @returns {Promise<Array>} Mảng categories
   */
  getAllCategories: async () => {
    const response = await http.get(categoryEndpoint.getAll);
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết của một category
   * @param {number} categoryId - ID của category
   * @returns {Promise<Object>} Thông tin category
   */
  getCategoryById: async (categoryId) => {
    const response = await http.get(categoryEndpoint.getById(categoryId));
    return response.data;
  },
};
