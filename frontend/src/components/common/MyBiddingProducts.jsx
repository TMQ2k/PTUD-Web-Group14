import React, { useState } from "react";
import ProductCard from "./ProductCard";
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
//test image
import electronicsImg from "../../assets/electronics.jpg";

// Mock data - Sản phẩm đang tham gia đấu giá
const mockBiddingProducts = [
  {
    id: 1,
    image: electronicsImg,
    name: "Đồng hồ cơ Orient Bambino Gen 4",
    currentPrice: "2,450,000",
    highestBidder: "Van Cong Khoa", // Người đang dẫn đầu
    myBidPrice: "2,400,000", // Giá bạn đã đấu
    buyNowPrice: "3,200,000",
    postedDate: "05/11/2025",
    remainingTime: "00:04:32",
    bidCount: 12,
    status: "active", // active (còn hạn), expired (hết hạn)
    isWinning: false, // Bạn có đang dẫn đầu không?
  },
  {
    id: 2,
    image: electronicsImg,
    name: "iPhone 15 Pro Max 256GB - Titan Blue",
    currentPrice: "31,200,000",
    highestBidder: "Bạn", // Bạn đang dẫn đầu
    myBidPrice: "31,200,000",
    buyNowPrice: "33,000,000",
    postedDate: "06/11/2025",
    remainingTime: "02:09:15",
    bidCount: 15,
    status: "active",
    isWinning: true,
  },
  {
    id: 3,
    image: electronicsImg,
    name: "Tai nghe Sony WH-1000XM5",
    currentPrice: "5,200,000",
    highestBidder: "Le Bao Anh",
    myBidPrice: "5,100,000",
    buyNowPrice: "6,000,000",
    postedDate: "06/11/2025",
    remainingTime: "05:12:10",
    bidCount: 9,
    status: "active",
    isWinning: false,
  },
  {
    id: 4,
    image: electronicsImg,
    name: "MacBook Air M2 2023 13 inch 8GB/256GB",
    currentPrice: "22,900,000",
    highestBidder: "Bạn",
    myBidPrice: "22,900,000",
    buyNowPrice: "25,000,000",
    postedDate: "02/11/2025",
    remainingTime: "08:20:00",
    bidCount: 42,
    status: "active",
    isWinning: true,
  },
  // Đã hết hạn
  {
    id: 5,
    image: electronicsImg,
    name: "Giày Nike Air Jordan 1 Retro High OG",
    currentPrice: "6,500,000",
    highestBidder: "Tran Thi Nhi",
    myBidPrice: "6,300,000",
    buyNowPrice: null,
    postedDate: "05/11/2025",
    remainingTime: "00:00:00",
    bidCount: 22,
    status: "expired",
    isWinning: false, // Thua
    finalResult: "lost", // won hoặc lost
  },
  {
    id: 6,
    image: electronicsImg,
    name: "iPad Pro 2022 M2 11 inch Wi-Fi 128GB",
    currentPrice: "18,200,000",
    highestBidder: "Bạn",
    myBidPrice: "18,200,000",
    buyNowPrice: "20,000,000",
    postedDate: "01/11/2025",
    remainingTime: "00:00:00",
    bidCount: 39,
    status: "expired",
    isWinning: true,
    finalResult: "won", // Thắng
  },
  {
    id: 7,
    image: electronicsImg,
    name: "Máy ảnh Canon EOS R6 Mark II",
    currentPrice: "33,500,000",
    highestBidder: "Do Thi Yen",
    myBidPrice: "32,000,000",
    buyNowPrice: "36,000,000",
    postedDate: "04/11/2025",
    remainingTime: "00:00:00",
    bidCount: 45,
    status: "expired",
    isWinning: false,
    finalResult: "lost",
  },
];

const MyBiddingProducts = () => {
  const [activeTab, setActiveTab] = useState("active"); // "active" hoặc "expired"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 4 dòng x 2 sản phẩm = 8 sản phẩm mỗi trang

  // Lọc sản phẩm theo tab
  const filteredProducts = mockBiddingProducts.filter(
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
  const activeCount = mockBiddingProducts.filter(
    (p) => p.status === "active"
  ).length;
  const expiredCount = mockBiddingProducts.filter(
    (p) => p.status === "expired"
  ).length;
  const winningCount = mockBiddingProducts.filter(
    (p) => p.status === "active" && p.isWinning
  ).length;
  const wonCount = mockBiddingProducts.filter(
    (p) => p.status === "expired" && p.finalResult === "won"
  ).length;

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Đang đấu giá</p>
              <p className="text-2xl font-bold text-blue-700">{activeCount}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Đang dẫn đầu</p>
              <p className="text-2xl font-bold text-green-700">
                {winningCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Đã thắng</p>
              <p className="text-2xl font-bold text-purple-700">{wonCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Đã kết thúc</p>
              <p className="text-2xl font-bold text-gray-700">{expiredCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-gray-500" />
          </div>
        </div>
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
