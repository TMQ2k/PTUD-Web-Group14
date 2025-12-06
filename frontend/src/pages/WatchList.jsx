import React, { useEffect, useState } from "react";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/common/ProductCard";
import { watchlistApi } from "../api/watchlist.api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const WatchList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // Scroll to top khi vào trang
    window.scrollTo({ top: 0, behavior: "instant" });

    // Kiểm tra user đã đăng nhập chưa
    if (!user.isLoggedIn) {
      navigate("/");
      return;
    }

    fetchWatchlist();
  }, [user.isLoggedIn, navigate]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await watchlistApi.getWatchlist();

      // Transform data từ backend sang format của ProductCard
      const transformedProducts = response.data.map((item) => {
        // Calculate remaining time
        const remainingTime = calculateRemainingTime(item.end_time);

        // Format posted date (backend trả về product_created_at)
        const createdAt = new Date(item.product_created_at);
        const postedDate = isNaN(createdAt.getTime())
          ? "--/--/----"
          : `${String(createdAt.getDate()).padStart(2, "0")}/${String(
              createdAt.getMonth() + 1
            ).padStart(2, "0")}/${createdAt.getFullYear()}`;

        // Format price (không có dấu ₫ vì ProductCard tự thêm)
        const formattedPrice = new Intl.NumberFormat("vi-VN").format(
          item.current_price || 0
        );

        return {
          id: item.product_id,
          image: item.image_cover_url || "/placeholder.jpg",
          name: item.product_name,
          currentPrice: formattedPrice,
          highestBidder: item.highest_bidder_name || "Đang cập nhật",
          buyNowPrice: item.buy_now_price
            ? new Intl.NumberFormat("vi-VN").format(item.buy_now_price)
            : null,
          postedDate: postedDate,
          remainingTime: remainingTime,
          bidCount: item.bid_count || 0,
          isInWatchlist: true, // Đã biết chắc là trong watchlist
        };
      });

      setProducts(transformedProducts);
    } catch (err) {
      console.error("❌ Lỗi khi tải watchlist:", err);
      setError(err.message || "Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingTime = (endTime) => {
    if (!endTime) return "00:00:00";

    const end = new Date(endTime);
    const now = new Date();
    const diff = Math.max(0, Math.floor((end - now) / 1000));

    const hours = Math.floor(diff / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((diff % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (diff % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const handleRemoveFromWatchlist = async (productId) => {
    try {
      await watchlistApi.removeFromWatchlist(productId);
      // Cập nhật UI: xóa sản phẩm khỏi danh sách
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("❌ Lỗi khi xóa khỏi watchlist:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Đang tải danh sách yêu thích...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWatchlist}
            className="px-6 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-linear-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Danh sách yêu thích
                </h1>
                <p className="text-gray-600 mt-1">
                  {products.length} sản phẩm đang theo dõi
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Danh sách sản phẩm */}
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Chưa có sản phẩm yêu thích
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Hãy khám phá và thêm những sản phẩm bạn quan tâm vào danh sách yêu
              thích để theo dõi dễ dàng hơn!
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Khám phá ngay
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <ProductCard
                    {...product}
                    onRemoveFromWatchlist={() =>
                      handleRemoveFromWatchlist(product.id)
                    }
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default WatchList;
