import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { productApi } from "../api/product.api";
import { watchlistApi } from "../api/watchlist.api";
import { useSelector } from "react-redux";
import FilterPanel from "../components/common/FilterPanel";
import SearchResults from "../components/common/SearchResults";
import electronicsImg from "../assets/electronics.jpg";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  // Get params from URL
  const searchQuery = searchParams.get("q") || "";
  const sortBy = searchParams.get("sortBy") || "endtime_desc";
  const isActive = searchParams.get("is_active") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 8; // 8 sản phẩm mỗi trang

  const [totalPages, setTotalPages] = useState(1);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Fetch watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user.isLoggedIn) return;

      try {
        const response = await watchlistApi.getWatchlist();
        const ids = new Set(response.data.map((item) => item.product_id));
        setWatchlistIds(ids);
      } catch (error) {
        console.error("❌ Lỗi khi fetch watchlist:", error);
      }
    };

    fetchWatchlist();
  }, [user.isLoggedIn]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          q: searchQuery,
          limit,
          page,
          sortBy,
        };

        // Chỉ thêm is_active nếu có giá trị
        if (isActive !== "") {
          params.is_active = isActive === "true";
        }

        const response = await productApi.searchProducts(params);

        // Transform data
        const transformedProducts = response.data.map((product) => {
          // Calculate remaining time
          const endTime = new Date(product.end_time);
          const now = new Date();
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

          // Format posted date
          const createdAt = new Date(product.created_at);
          const postedDate = isNaN(createdAt.getTime())
            ? "--/--/----"
            : `${String(createdAt.getDate()).padStart(2, "0")}/${String(
                createdAt.getMonth() + 1
              ).padStart(2, "0")}/${createdAt.getFullYear()}`;

          // Format price
          const formattedPrice = new Intl.NumberFormat("vi-VN").format(
            product.current_price
          );

          // Check if new (trong vòng 60 phút)
          const createdTime = new Date(product.created_at);
          const nowTime = new Date();
          const diffMinutesFromCreation = Math.floor(
            (nowTime - createdTime) / (1000 * 60)
          );
          const isNew = diffMinutesFromCreation <= 60;

          return {
            id: product.product_id,
            image: product.image_cover_url || electronicsImg,
            name: product.name,
            currentPrice: formattedPrice,
            highestBidder: product.top_bidder?.username || "Chưa có",
            buyNowPrice: product.buy_now_price
              ? new Intl.NumberFormat("vi-VN").format(product.buy_now_price)
              : null,
            postedDate: postedDate,
            remainingTime: remainingTime,
            bidCount: product.history_count || 0,
            is_active: product.is_active,
            isNew: isNew, // Flag sản phẩm mới
          };
        });

        setProducts(transformedProducts);

        // Calculate total pages (giả sử backend trả về tất cả, hoặc cần thêm total_count từ BE)
        // Tạm thời set totalPages dựa vào số sản phẩm trả về
        setTotalPages(transformedProducts.length < limit ? page : page + 1);
      } catch (err) {
        console.error("❌ Lỗi khi fetch products:", err);
        setError(
          err.response?.data?.message || "Không thể tải danh sách sản phẩm."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, sortBy, isActive, page]);

  // Handlers
  const handleSortChange = (newSortBy) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", newSortBy);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleStatusChange = (newStatus) => {
    const newParams = new URLSearchParams(searchParams);
    if (newStatus) {
      newParams.set("is_active", newStatus);
    } else {
      newParams.delete("is_active");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SearchIcon className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Kết Quả Tìm Kiếm
            </h1>
          </div>
          {searchQuery && (
            <p className="text-gray-600 text-lg">
              Kết quả cho:{" "}
              <strong className="text-purple-600">"{searchQuery}"</strong>
            </p>
          )}
        </div>

        {/* Filter Panel */}
        <div className="mb-8">
          <FilterPanel
            sortBy={sortBy}
            isActive={isActive}
            onSortChange={handleSortChange}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-700 text-lg">
              Tìm thấy{" "}
              <strong className="text-purple-600">{products.length}</strong> sản
              phẩm
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-600 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Search Results */}
        <SearchResults
          products={products}
          loading={loading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          watchlistIds={watchlistIds}
        />
      </div>
    </div>
  );
};

export default SearchPage;
