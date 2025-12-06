import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Home, Filter, SortAsc } from "lucide-react";
import { productApi } from "../api/product.api";
import { categoryApi } from "../api/category.api";
import { watchlistApi } from "../api/watchlist.api";
import ProductCard from "../components/common/ProductCard";
import electronicsImg from "../assets/electronics.jpg";
import { useSelector } from "react-redux";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("default"); // default, price-asc, price-desc, time
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const user = useSelector((state) => state.user);
  // Scroll to top khi component mount (reload trang)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Fetch watchlist để check sản phẩm nào đã yêu thích
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

  useEffect(() => {
    // Scroll to top khi thay đổi categoryId
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch products by category
        const productsResponse = await productApi.getProductsByCategory(
          parseInt(categoryId)
        );

        // Transform products data
        const transformedProducts = productsResponse.data.map((product) => {
          // Calculate remaining time
          const endTime = new Date(product.end_time);
          const now = new Date();
          const diffMs = endTime - now;
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMinutes = Math.floor(
            (diffMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          const remainingTime = `${String(diffHours).padStart(2, "0")}:${String(
            diffMinutes
          ).padStart(2, "0")}:${String(diffSeconds).padStart(2, "0")}`;

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

          return {
            id: product.product_id,
            image: product.image_cover_url || electronicsImg,
            name: product.name,
            currentPrice: formattedPrice,
            highestBidder: "Đang cập nhật",
            buyNowPrice: product.buy_now_price
              ? new Intl.NumberFormat("vi-VN").format(product.buy_now_price)
              : null,
            postedDate: postedDate,
            remainingTime: remainingTime,
            bidCount: product.bid_count || 0,
          };
        });

        setProducts(transformedProducts);

        // Fetch category info to get name and parent
        try {
          const allCategories = await categoryApi.getAllCategories();
          const currentCategory = findCategoryById(
            allCategories.data,
            parseInt(categoryId)
          );

          if (currentCategory) {
            setCategoryInfo(currentCategory);

            // Find parent category if exists
            if (currentCategory.parent_id) {
              const parent = findCategoryById(
                allCategories.data,
                currentCategory.parent_id
              );
              setParentCategory(parent);
            }
          }
        } catch (catError) {
          console.error("❌ Lỗi khi fetch category info:", catError);
          // Continue even if category info fails
        }
      } catch (err) {
        console.error("❌ Lỗi khi fetch products:", err);
        setError(
          err.response?.data?.message ||
            "Không thể tải danh sách sản phẩm. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Helper function to find category by id in nested structure
  const findCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category.category_id === id) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Sort products
  const sortProducts = (productsToSort) => {
    const sorted = [...productsToSort];

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => {
          const priceA = parseInt(a.currentPrice.replace(/,/g, ""));
          const priceB = parseInt(b.currentPrice.replace(/,/g, ""));
          return priceA - priceB;
        });
      case "price-desc":
        return sorted.sort((a, b) => {
          const priceA = parseInt(a.currentPrice.replace(/,/g, ""));
          const priceB = parseInt(b.currentPrice.replace(/,/g, ""));
          return priceB - priceA;
        });
      case "time":
        return sorted.sort((a, b) => {
          const timeA = a.remainingTime.split(":").map(Number);
          const timeB = b.remainingTime.split(":").map(Number);
          const totalSecondsA = timeA[0] * 3600 + timeA[1] * 60 + timeA[2];
          const totalSecondsB = timeB[0] * 3600 + timeB[1] * 60 + timeB[2];
          return totalSecondsA - totalSecondsB;
        });
      default:
        return sorted;
    }
  };

  const sortedProducts = sortProducts(products);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-linear-to-r from-blue-400 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-purple-700 transition-all"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="bg-linear-to-r from-white to-purple-50 rounded-xl shadow-md p-5 mb-6 border border-purple-100">
          <div className="flex items-center gap-3 text-sm flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>

            <ChevronRight className="w-5 h-5 text-purple-400" />

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-md">
              <span className="font-semibold">
                {parentCategory?.name || "..."}
              </span>
              <span className="text-purple-200">→</span>
              <span className="font-bold">
                {categoryInfo?.name || `Category #${categoryId}`}
              </span>
            </div>
          </div>
        </div>

        {/* Header với breadcrumb path */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {parentCategory?.name || "..."} →{" "}
              {categoryInfo?.name || `Danh mục #${categoryId}`}
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Tìm thấy{" "}
            <strong className="text-purple-600">{products.length}</strong> sản
            phẩm
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Lọc và sắp xếp:</span>
            </div>

            <div className="flex items-center gap-3">
              <SortAsc className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-gray-700 font-medium"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="time">Sắp kết thúc</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isInWatchlist={watchlistIds.has(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Chưa có sản phẩm nào
            </h3>
            <p className="text-gray-600 mb-6">
              Danh mục này hiện chưa có sản phẩm đấu giá.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-linear-to-r from-blue-400 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-purple-700 transition-all"
            >
              Khám phá các danh mục khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
