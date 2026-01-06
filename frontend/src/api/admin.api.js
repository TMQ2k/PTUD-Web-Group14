import { http } from "../libs/http";

const adminEndpoint = {
  // Category endpoints
  createCategory: "/categories/create",
  deleteCategory: "/categories/delete",
  updateCategoryName: "/categories/update-name",

  // User endpoints
  getAllUsers: "/users",
  deleteUser: "/users/delete-user",
  resetUserPassword: "/users/admin/change-password",

  // Product endpoints
  deleteProduct: "/products/delete",

  // Upgrade Request endpoints
  requestUpgrade: "/bidder/request-upgrade",
  getUpgradeRequests: "/bidder/upgrade-requests",
  handleUpgradeRequest: "/bidder/handle-upgrade-request",
};

export const adminApi = {
  // ========== CATEGORY MANAGEMENT ==========

  /**
   * Tạo category mới
   * @param {Object} categoryData - { name, parentId }
   * @returns {Promise<Object>} Category vừa tạo
   */
  createCategory: async (categoryData) => {
    const response = await http.post(
      adminEndpoint.createCategory,
      categoryData
    );
    return response.data;
  },

  /**
   * Xóa category
   * @param {number} categoryId - ID của category cần xóa
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteCategory: async (categoryId) => {
    const response = await http.delete(adminEndpoint.deleteCategory, {
      data: { categoryId },
    });
    return response.data;
  },

  /**
   * Cập nhật tên category
   * @param {number} categoryId - ID của category
   * @param {string} newName - Tên mới
   * @returns {Promise<Object>} Category sau khi cập nhật
   */
  updateCategoryName: async (categoryId, newName) => {
    const response = await http.patch(adminEndpoint.updateCategoryName, {
      categoryId,
      newName,
    });
    return response.data;
  },

  // ========== USER MANAGEMENT ==========

  /**
   * Lấy tất cả users
   * @returns {Promise<Array>} Mảng users
   */
  getAllUsers: async () => {
    const response = await http.get(adminEndpoint.getAllUsers);
    return response.data;
  },

  /**
   * Xóa user
   * @param {number} userId - ID của user cần xóa
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteUser: async (userId) => {
    const response = await http.delete(adminEndpoint.deleteUser, {
      data: { userId },
    });
    return response.data;
  },

  /**
   * Đặt lại mật khẩu user (admin only)
   * @param {number} userId - ID của user cần đổi mật khẩu
   * @returns {Promise<Object>} Thông tin mật khẩu mới
   */
  resetUserPassword: async (userId) => {
    const response = await http.post(adminEndpoint.resetUserPassword, {
      userId,
    });
    return response.data;
  },

  // ========== PRODUCT MANAGEMENT ==========

  /**
   * Xóa product
   * @param {number} productId - ID của product cần xóa
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteProduct: async (productId) => {
    const response = await http.delete(adminEndpoint.deleteProduct, {
      data: { productId },
    });
    return response.data;
  },

  // ========== UPGRADE REQUEST MANAGEMENT ==========

  /**
   * Bidder gửi request nâng cấp lên seller
   * @returns {Promise<Object>} Kết quả request
   */
  requestUpgradeToSeller: async () => {
    const response = await http.post(adminEndpoint.requestUpgrade);
    return response.data;
  },

  /**
   * Admin lấy tất cả upgrade requests
   * @returns {Promise<Array>} Mảng requests
   */
  getUpgradeRequests: async () => {
    const response = await http.get(adminEndpoint.getUpgradeRequests);
    return response.data;
  },

  /**
   * Admin xử lý upgrade request (approve/reject)
   * @param {number} userId - ID của user
   * @param {boolean} approve - true = approve, false = reject
   * @returns {Promise<Object>} Kết quả xử lý
   */
  handleUpgradeRequest: async (userId, approve) => {
    const response = await http.post(adminEndpoint.handleUpgradeRequest, {
      userId,
      approve: approve ? "approved" : "rejected", // Chuyển boolean sang string
    });
    return response.data;
  },

  /**
   * Bidder lấy trạng thái upgrade request của chính mình
   * @returns {Promise<Object>} Trạng thái request (null nếu chưa có)
   */
  getMyUpgradeStatus: async () => {
    const response = await http.get(adminEndpoint.getUpgradeRequests);
    // Filter để lấy request của current user từ userData trong Redux
    return response.data;
  },
};
