import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { bidderApi } from "../../api/bidder.api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MyBiddingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "active" hoặc "expired"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 4 sản phẩm mỗi trang
  const user = useSelector((state) => state.user);
  const userId = user.isLoggedIn ? user.userData.id : null;
  useEffect(() => {
    const fetchBiddedProducts = async () => {
      try {
        setLoading(true);
        const response = await bidderApi.getBidderProducts();

        // Transform data from backend
        const transformedProducts = biddedProducts.map((item) => {
          const now = new Date();
          const endTime = new Date(item.end_time);
          const isActive = endTime > now;

          // Calculate remaining time
          const diffMs = endTime - now;
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMinutes = Math.floor(
            (diffMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          const remainingTime = `${String(Math.max(0, diffHours)).padStart(
            2,
            "0"
          )}:${String(Math.max(0, diffMinutes)).padStart(2, "0")}:${String(
            Math.max(0, diffSeconds)
          ).padStart(2, "0")}`;

          // Format prices
          const formattedCurrentPrice = new Intl.NumberFormat("vi-VN").format(
            item.current_price
          );
          // const formattedMyBidPrice = new Intl.NumberFormat("vi-VN").format(
          //   item.max_bid_amount
          // );

          return {
            id: item.product_id,
            name: item.name,
            currentPrice: formattedCurrentPrice,
            //myBidPrice: formattedMyBidPrice,
            highestBidder: item.top_bidder?.username || null,
            image: item.image_cover_url,
            postedDate: new Date(item.end_time).toLocaleDateString("vi-VN"),
            remainingTime: remainingTime,
            bidCount: item.history_count || 0,
            endTime: item.end_time,
            status: isActive ? "active" : "expired",
            //isWinning: item.is_winner,
            isLeadingBidder: isActive && item.is_highest_bidder === true, // ✅ Đang dẫn đầu nếu còn hạn và là người đấu giá cao nhất
            //finalResult: !isActive ? (item.is_winner ? "won" : "lost") : null,
            sellerId: item.seller_id,
            is_active: isActive,
          };
        });

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm đã đấu giá:", error);
        toast.error("Không thể tải danh sách sản phẩm đã đấu giá");
      } finally {
        setLoading(false);
      }
    };
    fetchBiddedProducts();
  }, [userId]);

  // const fetchBiddedProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await bidderApi.getBidderProducts();
  //     console.log(response.data);
  //     const biddedProducts = response.data || [];

  //     // Transform data from backend
  //     const transformedProducts = biddedProducts.map((item) => {
  //       const now = new Date();
  //       const endTime = new Date(item.end_time);
  //       const isActive = endTime > now;

  //       // Calculate remaining time
  //       const diffMs = endTime - now;
  //       const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  //       const diffMinutes = Math.floor(
  //         (diffMs % (1000 * 60 * 60)) / (1000 * 60)
  //       );
  //       const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  //       const remainingTime = `${String(Math.max(0, diffHours)).padStart(
  //         2,
  //         "0"
  //       )}:${String(Math.max(0, diffMinutes)).padStart(2, "0")}:${String(
  //         Math.max(0, diffSeconds)
  //       ).padStart(2, "0")}`;

  //       // Format prices
  //       const formattedCurrentPrice = new Intl.NumberFormat("vi-VN").format(
  //         item.current_price
  //       );
  //       // const formattedMyBidPrice = new Intl.NumberFormat("vi-VN").format(
  //       //   item.max_bid_amount
  //       // );

  //       return {
  //         id: item.product_id,
  //         name: item.name,
  //         currentPrice: formattedCurrentPrice,
  //         //myBidPrice: formattedMyBidPrice,
  //         highestBidder: item.top_bidder?.username || null,
  //         image: item.image_cover_url,
  //         postedDate: new Date(item.end_time).toLocaleDateString("vi-VN"),
  //         remainingTime: remainingTime,
  //         bidCount: 0,
  //         endTime: item.end_time,
  //         status: isActive ? "active" : "expired",
  //         //isWinning: item.is_winner,
  //         isLeadingBidder: isActive && userId === item.product_id, // Đang dẫn đầu nếu đang active và là winner
  //         //finalResult: !isActive ? (item.is_winner ? "won" : "lost") : null,
  //         sellerId: item.seller_id,
  //         is_active: isActive,
  //       };
  //     });

  //     setProducts(transformedProducts);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy sản phẩm đã đấu giá:", error);
  //     toast.error("Không thể tải danh sách sản phẩm đã đấu giá");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Lọc sản phẩm theo tab
  const filteredProducts = products.filter(
    (product) => product.status === activeTab
  );

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset về trang 1 khi đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Thống kê
  const activeCount = products.filter((p) => p.status === "active").length;
  const expiredCount = products.filter((p) => p.status === "expired").length;
  const winningCount = products.filter(
    (p) => p.status === "active" && p.isWinning
  ).length;
  const wonCount = products.filter(
    (p) => p.status === "expired" && p.finalResult === "won"
  ).length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sản phẩm tham gia đấu giá
        </h2>
        <p className="text-gray-600 text-sm">
          Theo dõi các sản phẩm bạn đang tham gia đấu giá
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => handleTabChange("active")}
            className={`pb-3 px-2 font-medium transition-colors relative ${
              activeTab === "active"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Còn hạn ({activeCount})
          </button>
          <button
            onClick={() => handleTabChange("expired")}
            className={`pb-3 px-2 font-medium transition-colors relative ${
              activeTab === "expired"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Đã hết hạn ({expiredCount})
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                customFooter={
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Giá bạn đã đấu:</span>
                      <span className="font-bold text-blue-600">
                        {product.myBidPrice}₫
                      </span>
                    </div>
                  </div>
                }
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeTab === "active"
              ? "Chưa có sản phẩm đang đấu giá"
              : "Chưa có sản phẩm đã kết thúc"}
          </h3>
          <p className="text-gray-500 text-sm">
            {activeTab === "active"
              ? "Hãy tham gia đấu giá các sản phẩm yêu thích của bạn"
              : "Các sản phẩm đã kết thúc sẽ hiển thị ở đây"}
          </p>
        </div>
      )}

      {/* Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Lưu ý:</strong> Theo dõi thời gian còn lại để đưa ra quyết
          định đấu giá kịp thời. Khi đấu giá kết thúc, bạn sẽ nhận được thông
          báo về kết quả.
        </p>
      </div>
    </div>
  );
};

export default MyBiddingProducts;
