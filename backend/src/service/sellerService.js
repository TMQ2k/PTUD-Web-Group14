import {
  deactivateAllSellerExpiredRepo,
  getSellerStartTimeRepo,
} from "../repo/sellerRepo.js";

export const deactivateAllSellerExpiredService = async () => {
  try {
    const result = await deactivateAllSellerExpiredRepo();
    return result;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi vô hiệu hóa tất cả người bán hết hạn:",
      err
    );
    throw err;
  }
};

export const getSellerStartTimeService = async (sellerId) => {
  try {
    const result = await getSellerStartTimeRepo(sellerId);
    return result;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi lấy thời gian bắt đầu người bán:", err);
    throw err;
  }
};
