import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { userApi } from "../../api/user.api";

const RatingHistory = () => {
  const { userData } = useSelector((state) => state.user);
  const [ratingData, setRatingData] = useState({
    totalRatings: 0,
    positiveRatings: 0,
    negativeRatings: 0,
    ratingScore: 0,
    ratingPercentage: 0,
    reviews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        setLoading(true);

        // Fetch user profile để lấy rating_plus, rating_minus, rating_percent
        const profileResponse = await userApi.getProfile();
        const profile = profileResponse.data;

        // Fetch rating history
        const ratingsResponse = await userApi.getUserRatings();
        const reviews = ratingsResponse.data || [];

        const positiveRatings = Number(profile.rating_plus) || 0;
        const negativeRatings = Number(profile.rating_minus) || 0;
        const totalRatings = positiveRatings + negativeRatings;
        const ratingPercentage = Number(profile.rating_percent) || 0;

        setRatingData({
          totalRatings,
          positiveRatings,
          negativeRatings,
          ratingScore: positiveRatings - negativeRatings,
          ratingPercentage,
          reviews: reviews.map((review) => ({
            id: review.review_id,
            rating: review.value, // 1 or -1
            comment: review.content || "",
            fromUserId: review.from_user,
            createdAt: review.created_at,
          })),
        });
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu đánh giá:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchRatingData();
    }
  }, [userData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Hôm nay";
    } else if (diffInDays === 1) {
      return "Hôm qua";
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} tuần trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Điểm đánh giá của bạn
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Xem tổng quan và chi tiết các lần được đánh giá từ người dùng khác
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Rating Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Total Score */}
            <div className="bg-white border-blue-700 border-2 rounded-xl p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-2">Điểm tổng</p>
              <p className="text-4xl font-bold text-blue-700 mb-1">
                {ratingData.ratingScore > 0 ? "+" : ""}
                {ratingData.ratingScore}
              </p>
              <p className="text-xs text-gray-400">
                {ratingData.ratingPercentage.toFixed(0)}% tích cực
              </p>
            </div>

            {/* Total Ratings */}
            <div className="bg-white border-orange-600 border-2 rounded-xl p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-2">Tổng đánh giá</p>
              <p className="text-4xl font-bold text-orange-600 mb-1">
                {ratingData.totalRatings}
              </p>
              <p className="text-xs text-gray-400">lượt đánh giá</p>
            </div>

            {/* Positive Ratings */}
            <div className="bg-white border-green-600 border-2 rounded-xl p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-2">Hài lòng</p>
              <p className="text-4xl font-bold text-green-600 mb-1">
                {ratingData.positiveRatings}
              </p>
              <p className="text-xs text-gray-400">
                {ratingData.totalRatings > 0
                  ? Math.round(
                      (ratingData.positiveRatings / ratingData.totalRatings) *
                        100
                    )
                  : 0}
                % tích cực
              </p>
            </div>

            {/* Negative Ratings */}
            <div className="bg-white border-red-600 border-2 rounded-xl p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-2">Chưa hài lòng</p>
              <p className="text-4xl font-bold text-red-600 mb-1">
                {ratingData.negativeRatings}
              </p>
              <p className="text-xs text-gray-400">
                {ratingData.totalRatings > 0
                  ? Math.round(
                      (ratingData.negativeRatings / ratingData.totalRatings) *
                        100
                    )
                  : 0}
                % tiêu cực
              </p>
            </div>
          </div>

          {/* Rating History */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Lịch sử đánh giá
            </h3>

            {ratingData.reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có đánh giá nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratingData.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Rating Badge */}
                        <div
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-sm ${
                            review.rating === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {review.rating === 1 ? (
                            <>
                              <ThumbsUp className="w-4 h-4" />
                              <span>+1</span>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-4 h-4" />
                              <span>-1</span>
                            </>
                          )}
                        </div>

                        {/* Rater Info */}
                        <div>
                          <p className="font-semibold text-gray-900">
                            Người đánh giá: #{review.fromUserId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    )}

                    {!review.comment && (
                      <div className="text-sm text-gray-400 italic">
                        Người đánh giá không để lại nhận xét
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              💡 <strong>Gợi ý:</strong> Điểm đánh giá cao giúp bạn tăng uy tín
              và được cộng đồng tin tưởng hơn. Hãy luôn giao dịch trung thực và
              chuyên nghiệp!
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default RatingHistory;
