import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Clock, Tag, User, Heart } from "lucide-react";
import { FaFire } from "react-icons/fa";
import { watchlistApi } from "../../api/watchlist.api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductCard = ({
  id,
  image,
  name,
  currentPrice,
  highestBidder,
  buyNowPrice,
  postedDate,
  remainingTime,
  bidCount,
  onBuyNow,
  isInWatchlist = false,
  onRemoveFromWatchlist,
  is_active = true,
  isNew = false, // Sản phẩm mới đăng (trong vòng 60 phút)
}) => {
  const [timeLeft, setTimeLeft] = useState(remainingTime);
  const [isFavorite, setIsFavorite] = useState(isInWatchlist);
  const [isToggling, setIsToggling] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFavorite(isInWatchlist);
  }, [isInWatchlist]);

  useEffect(() => {
    const parseTime = (timeStr) => {
      if (typeof timeStr === "number") return timeStr;
      const [h, m, s] = timeStr.split(":").map(Number);
      return h * 3600 + m * 60 + s;
    };

    let timeInSeconds = parseTime(remainingTime);

    const timer = setInterval(() => {
      if (timeInSeconds > 0) {
        timeInSeconds -= 1;
        const hours = Math.floor(timeInSeconds / 3600)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((timeInSeconds % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleToggleFavorite = async (e) => {
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
        await watchlistApi.removeFromWatchlist(id);
        setIsFavorite(false);
        toast.success("Đã xóa khỏi danh sách yêu thích");

        // Nếu đang ở trang WatchList, gọi callback để cập nhật danh sách
        if (onRemoveFromWatchlist) {
          onRemoveFromWatchlist();
        }
      } else {
        // Thêm vào watchlist
        await watchlistApi.addToWatchlist(id);
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
    <div
      onClick={() => navigate(`/products/${id}`)}
      className={`cursor-pointer group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border flex flex-col ${
        isNew
          ? "border-2 border-yellow-400 ring-4 ring-yellow-100 shadow-yellow-200/50"
          : "border-gray-100 hover:border-purple-200"
      }`}
    >
      {/* Ảnh sản phẩm với overlay gradient */}
      <div className="relative w-full h-45 overflow-hidden bg-linear-to-br from-gray-100 to-gray-50">
        <img
          src={image}
          alt={name}
          className="object-cover object-top w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradient overlay khi hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Overlay khi hết hạn */}
        {!is_active && (
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]" />
        )}

        {/* Badge NEW cho sản phẩm mới */}
        {isNew && (
          <div className="absolute top-3 left-3 bg-linear-to-r from-yellow-400 via-amber-500 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg animate-pulse z-20 flex items-center gap-1">
            <span className="text-lg">✨</span>
            <span>MỚI</span>
          </div>
        )}

        {/* Nút yêu thích */}
        <button
          onClick={handleToggleFavorite}
          disabled={isToggling}
          className={`absolute ${
            isNew ? "top-14" : "top-3"
          } left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10 ${
            isToggling ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Yêu thích"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isFavorite
                ? "fill-red-500 stroke-red-500 animate-pulse"
                : "stroke-gray-600 hover:stroke-red-500"
            }`}
          />
        </button>

        {/* Thời gian còn lại */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md ${
            !is_active
              ? "bg-gray-500/95 text-white"
              : timeLeft < "00:10:00"
              ? "bg-red-500/95 text-white animate-pulse"
              : "bg-white/95 text-gray-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{!is_active ? "Đã hết hạn" : timeLeft}</span>
        </div>

        {/* Badge "Mua ngay" nếu có */}
        {buyNowPrice && (
          <div className="absolute bottom-3 left-3 bg-linear-to-r from-red-600 to-amber-400 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
            <FaFire className="inline w-4 h-4 mr-1 mb-1 text-orange-500" />
            Mua ngay: {buyNowPrice}₫
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="p-4 space-y-3">
        {/* Tên sản phẩm */}
        <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-purple-600 group-hover:bg-clip-text cursor-pointer transition-all duration-300 min-h-10">
          {name}
        </h3>

        {/* Giá hiện tại - Nổi bật */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100">
          <p className="text-xs text-gray-600 font-medium mb-1">
            Giá đấu hiện tại
          </p>
          <p className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            {currentPrice}₫
          </p>
        </div>

        {/* Info grid - 2 cột rõ ràng */}
        <div className="grid grid-cols-2 gap-3">
          {/* Người đấu cao nhất */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1.5">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600 font-medium">
                Cao nhất
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate">
              {highestBidder !== null
                ? `***${highestBidder.trim().split(" ").slice(-1)[0]}`
                : "Chưa có"}
            </p>
          </div>

          {/* Số lượt đấu */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Tag className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-600 font-medium">
                Lượt đấu
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900">{bidCount} lượt</p>
          </div>
        </div>

        {/* Ngày đăng */}
        <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg px-3 py-2 border border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700 font-medium">
              Đăng ngày: <strong className="text-blue-600">{postedDate}</strong>
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          {!is_active ? (
            <button
              disabled
              className="w-full py-3 bg-gray-400 text-white font-bold rounded-lg cursor-not-allowed opacity-60 text-base"
            >
              Đã hết hạn
            </button>
          ) : buyNowPrice ? (
            <>
              <button
                onClick={onBuyNow}
                className="w-full py-3 bg-linear-to-r from-blue-400 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base"
              >
                Đấu giá
              </button>
              <button className="w-full py-3 border-2 border-purple-400 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-colors duration-200 text-base">
                Mua ngay
              </button>
            </>
          ) : (
            <button className="w-full py-3 bg-linear-to-r from-blue-400 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base">
              Tham gia đấu giá
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;