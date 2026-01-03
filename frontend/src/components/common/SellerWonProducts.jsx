import React, { useState, useEffect } from "react";
import { Package, User, Mail, ThumbsUp, ThumbsDown } from "lucide-react";
import { userApi } from "../../api/user.api";
import { toast } from "react-toastify";

const RATING_VALUES = {
  LIKE: 1,
  DISLIKE: -1,
};

const SellerWonProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({}); // { [won_id]: { value, comment, submitted } }

  useEffect(() => {
    fetchDeactivatedProducts();
  }, []);

  const fetchDeactivatedProducts = async () => {
    try {
      setLoading(true);
      const response = await userApi.getSellerDeactivatedProducts();
      setProducts(response.data || []);

      // Initialize ratings state
      const initialRatings = {};
      (response.data || []).forEach((product) => {
        initialRatings[product.won_id] = {
          value: null,
          comment: "",
          submitted: false,
          submitting: false,
        };
      });
      setRatings(initialRatings);
    } catch (error) {
      console.error("Error fetching deactivated products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (wonId, value) => {
    if (ratings[wonId]?.submitted) return;

    setRatings((prev) => ({
      ...prev,
      [wonId]: {
        ...prev[wonId],
        value: prev[wonId]?.value === value ? null : value,
      },
    }));
  };

  const handleCommentChange = (wonId, comment) => {
    setRatings((prev) => ({
      ...prev,
      [wonId]: {
        ...prev[wonId],
        comment,
      },
    }));
  };

  const handleSubmitRating = async (wonId, bidderId) => {
    const rating = ratings[wonId];

    if (!rating?.value) {
      toast.error("Vui lòng chọn đánh giá +1 hoặc -1");
      return;
    }

    if (!bidderId) {
      toast.error("Không tìm thấy thông tin người thắng");
      return;
    }

    try {
      setRatings((prev) => ({
        ...prev,
        [wonId]: { ...prev[wonId], submitting: true },
      }));

      await userApi.judgeUser({
        to_user_id: bidderId.toString(),
        value: rating.value.toString(),
        content: rating.comment || "",
      });

      toast.success("Đã gửi đánh giá thành công!");

      setRatings((prev) => ({
        ...prev,
        [wonId]: { ...prev[wonId], submitted: true, submitting: false },
      }));
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá", error);
      toast.error(error.response?.data?.message || "Gửi đánh giá thất bại");

      setRatings((prev) => ({
        ...prev,
        [wonId]: { ...prev[wonId], submitting: false },
      }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sản phẩm đã có người thắng đấu giá
        </h2>
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Chưa có sản phẩm nào đã kết thúc đấu giá
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sản phẩm đã có người thắng đấu giá
        </h2>
        <p className="text-gray-600 text-sm">
          Quản lý các sản phẩm đã kết thúc đấu giá và thông tin người mua
        </p>
      </div>

      {/* Products List */}
      <div className="space-y-6">
        {products.map((product) => (
          <div
            key={product.won_id}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            {/* Product Info */}
            <div className="flex gap-4 mb-4">
              <img
                src={
                  product.product_image ||
                  "/images/default/product-placeholder.png"
                }
                alt={product.product_name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.product_name}
                </h3>
                <div className="flex items-center gap-1 text-green-600 mb-2">
                  <span className="font-bold text-lg">
                    {formatCurrency(product.winning_bid)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  ID đơn hàng: #{product.won_id}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Buyer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin người thắng
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-600">Tên người thắng:</p>
                    <p className="font-medium text-gray-900">
                      {product.bidder_name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium text-gray-900">
                      {product.bidder_email || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            {product.status !== "cancelled" && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                  Đánh giá người thắng đấu giá
                </h4>

                {ratings[product.won_id]?.submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-700 text-sm font-medium">
                      ✓ Đã gửi đánh giá thành công
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Rating Buttons */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 font-medium">
                        Chọn đánh giá:
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleRatingChange(
                              product.won_id,
                              RATING_VALUES.LIKE
                            )
                          }
                          disabled={ratings[product.won_id]?.submitting}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            ratings[product.won_id]?.value ===
                            RATING_VALUES.LIKE
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                              : "bg-white border border-green-300 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>+1</span>
                          <span className="hidden sm:inline">Hài lòng</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleRatingChange(
                              product.won_id,
                              RATING_VALUES.DISLIKE
                            )
                          }
                          disabled={ratings[product.won_id]?.submitting}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            ratings[product.won_id]?.value ===
                            RATING_VALUES.DISLIKE
                              ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md"
                              : "bg-white border border-red-300 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>-1</span>
                          <span className="hidden sm:inline">
                            Chưa hài lòng
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Comment Textarea */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">
                        Nhận xét thêm (tùy chọn):
                      </label>
                      <textarea
                        value={ratings[product.won_id]?.comment || ""}
                        onChange={(e) =>
                          handleCommentChange(product.won_id, e.target.value)
                        }
                        disabled={ratings[product.won_id]?.submitting}
                        rows={3}
                        placeholder="Chia sẻ trải nghiệm giao dịch với người thắng..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSubmitRating(product.won_id, product.bidder_id)
                      }
                      disabled={
                        !ratings[product.won_id]?.value ||
                        ratings[product.won_id]?.submitting
                      }
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
                    >
                      {ratings[product.won_id]?.submitting
                        ? "Đang gửi..."
                        : "Gửi đánh giá"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cancelled Notice */}
            {product.status === "cancelled" && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-700 text-sm font-medium">
                    ⚠️ Đơn hàng đã bị hủy - Không thể đánh giá
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerWonProducts;
