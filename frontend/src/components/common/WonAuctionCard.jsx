import React from "react";
import { useState } from "react";

// Kiểu rating: +1 (Like) | -1 (Dislike) | null (chưa chọn)
const RATING_VALUES = {
  LIKE: 1,
  DISLIKE: -1,
};

const WonAuctionCard = ({ product }) => {
  const [rating, setRating] = useState(null); // 1, -1 hoặc null
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // TODO [API-INTEGRATION-2]:
  //  - Thay logic giả lập dưới đây bằng gọi API thật, ví dụ:
  //    await fetch(`/api/sellers/${product.id}/rating`, {
  //      method: "POST",
  //      headers: { "Content-Type": "application/json" },
  //      body: JSON.stringify({ score: rating, comment }),
  //    });
  //  - Tùy API thực tế: có thể gửi sellerId, auctionId, productId...
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return; // bắt buộc phải chọn +1 / -1

    try {
      setSubmitting(true);

      // Giả lập delay API
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("[DEBUG] Gửi đánh giá:", {
        productId: product.id,
        sellerName: product.sellerName,
        rating,
        comment,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá", error);
      // TODO [API-INTEGRATION-3]:
      //  - Xử lý hiển thị lỗi (toast / thông báo UI)
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectRating = (value) => {
    if (submitted) return; // đã gửi thì không cho sửa nữa (tùy UX)
    setRating((prev) => (prev === value ? null : value));
  };
  return (
    <article className="bg-linear-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-xl p-5 sm:p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Thông tin sản phẩm & giá thắng */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Người bán:{" "}
            <span className="font-semibold text-gray-800">
              {product.sellerName}
            </span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
            Giá thắng đấu giá
          </p>
          <p className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {product.winningPrice.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>

      {/* Vùng đánh giá & nhận xét */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:gap-4 border-t border-gray-200 pt-4 sm:pt-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-700 font-semibold">
            Đánh giá người bán (bắt buộc):
          </p>

          {/* Nút rating: +1 / -1 */}
          <div className="inline-flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-300 shadow-sm">
            <button
              type="button"
              onClick={() => handleSelectRating(RATING_VALUES.LIKE)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1 transition-all
                ${
                  rating === RATING_VALUES.LIKE
                    ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-md"
                    : "bg-transparent text-green-600 hover:bg-green-50"
                }`}
              disabled={submitting || submitted}
            >
              <span>+1</span>
              <span className="hidden sm:inline">Hài lòng</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRating(RATING_VALUES.DISLIKE)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1 transition-all
                ${
                  rating === RATING_VALUES.DISLIKE
                    ? "bg-linear-to-r from-red-500 to-rose-500 text-white shadow-md"
                    : "bg-transparent text-red-600 hover:bg-red-50"
                }`}
              disabled={submitting || submitted}
            >
              <span>-1</span>
              <span className="hidden sm:inline">Chưa hài lòng</span>
            </button>
          </div>
        </div>

        {/* Nhận xét tùy chọn */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor={`comment-${product.id}`}
              className="text-sm text-gray-700 font-medium"
            >
              Nhận xét thêm (tùy chọn):
            </label>
            <span className="text-[11px] text-gray-500 italic">
              Giúp hệ thống đánh giá người bán chính xác hơn
            </span>
          </div>

          <textarea
            id={`comment-${product.id}`}
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm"
            placeholder="Ví dụ: Người bán giao hàng đúng hẹn, đóng gói cẩn thận..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting || submitted}
          />
        </div>

        {/* Khu vực action + trạng thái gửi */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
          <p className="text-xs text-gray-500">
            * Bạn chỉ cần chọn +1 hoặc -1 là có thể gửi đánh giá.
          </p>

          <div className="flex items-center gap-2 justify-end">
            {submitted && (
              <span className="text-xs sm:text-sm text-green-600 font-medium">
                ✓ Đã ghi nhận đánh giá của bạn. Cảm ơn!
              </span>
            )}

            <button
              type="submit"
              disabled={!rating || submitting || submitted}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold
                bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700
                disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 transition-all"
            >
              {submitting
                ? "Đang gửi..."
                : submitted
                ? "Đã gửi"
                : "Gửi đánh giá"}
            </button>
          </div>
        </div>
      </form>
    </article>
  );
};

export default WonAuctionCard;
