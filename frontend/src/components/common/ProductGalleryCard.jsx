//import { useParams } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { useProduct } from "../../context/ProductDetailsContext";
import { isEndingSoon } from "../../utils/DateTimeCalculation";
import ProductGallery from "./ProductGallery";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { watchlistApi } from "../../api/watchlist.api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductGalleryCard = () => {
  const product = useProduct();
  const [endingSoon, setEngdingSoon] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const user = useSelector((state) => state.user);

  const { created_at, end_time } = product;

  useEffect(() => {
    const interval_id = setInterval(() => {
      if (isEndingSoon(new Date(created_at), new Date(end_time))) {
        setEngdingSoon(true);
      }
    }, 1000);

    return () => {
      clearInterval(interval_id);
    };
  }, [created_at, end_time]);

  // Check if product is in watchlist
  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (!user.isLoggedIn || !product.product_id) return;
      
      try {
        const response = await watchlistApi.getWatchlist();
        const isInWatchlist = response.data?.some(
          (item) => item.product_id === product.product_id
        );
        setIsFavorite(isInWatchlist);
      } catch (error) {
        console.error("Error checking watchlist status:", error);
      }
    };

    checkWatchlistStatus();
  }, [user.isLoggedIn, product.product_id]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Kiểm tra đăng nhập
    if (!user.isLoggedIn) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    // Đang xử lý → Bỏ qua
    if (isToggling) return;

    setIsToggling(true);

    try {
      if (isFavorite) {
        // Xóa khỏi watchlist
        await watchlistApi.removeFromWatchlist(product.product_id);
        setIsFavorite(false);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        // Thêm vào watchlist
        await watchlistApi.addToWatchlist(product.product_id);
        setIsFavorite(true);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (err) {
      console.error("❌ Lỗi khi toggle watchlist:", err);
      toast.error(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      );
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <article className="w-full h-full">
      <header className="mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {endingSoon && (
              <h3 className="text-red-600 flex flex-row gap-1 font-semibold text-lg underline">
                <FaRegClock className="w-5 h-7" />
                <p>Sắp kết thúc</p>
              </h3>
            )}
            <h1 className="text-4xl font-bold">{product.name}</h1>
          </div>
          
          {/* Nút yêu thích */}
          <button
            onClick={handleToggleFavorite}
            disabled={isToggling}
            className={`flex-shrink-0 p-3 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 ${
              isFavorite 
                ? "border-red-500 bg-red-50" 
                : "border-gray-200 hover:border-red-300"
            } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Thêm vào yêu thích"
            title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart
              className={`w-7 h-7 transition-all duration-300 ${
                isFavorite
                  ? "fill-red-500 stroke-red-500"
                  : "stroke-gray-600 hover:stroke-red-500"
              }`}
            />
          </button>
        </div>
      </header>
      <article className="w-full">
        <ProductGallery />
      </article>
    </article>
  );
};

export default ProductGalleryCard;
