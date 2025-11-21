import { http } from "../libs/http";

const categoryEndpoint = {
  getAll: "/categories",
};

export const categoryApi = {
  /**
   * Lấy tất cả danh mục
   * @returns {Promise<Array>} Mảng danh mục
   */
  getAll: async () => {
    const response = await http.get(categoryEndpoint.getAll);
    return response.data;
  },
};
