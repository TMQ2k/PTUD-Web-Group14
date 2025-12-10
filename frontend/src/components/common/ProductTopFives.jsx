import React, { use } from "react";
import ProductCard from "./ProductCard";
import { TrendingUp, ClockFading, BanknoteArrowUp } from "lucide-react";
//test image
import electronicsImg from "../../assets/electronics.jpg";
import { useEffect, useState } from "react";
import { productApi } from "../../api/product.api";
import { watchlistApi } from "../../api/watchlist.api";
import { useSelector } from "react-redux";

const ProductTopFives = () => {
  const [top5HighestPriceProducts, setTop5HighestPriceProducts] = useState([]);
  const [top5EndingProducts, setTop5EndingProducts] = useState([]);
  const [top5MostBidProducts, setTop5MostBidProducts] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const user = useSelector((state) => state.user);

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
    const fetchTop5EndingProducts = async () => {
      try {
        const response = await productApi.getTop5EndingSoon();

        // Transform backend data to match ProductCard props
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
          const remainingTime = `${String(diffHours).padStart(2, "0")}:${String(
            diffMinutes
          ).padStart(2, "0")}:${String(diffSeconds).padStart(2, "0")}`;

          // Format posted date
          const createdAt = new Date(product.created_at);
          const postedDate = `${String(createdAt.getDate()).padStart(
            2,
            "0"
          )}/${String(createdAt.getMonth() + 1).padStart(
            2,
            "0"
          )}/${createdAt.getFullYear()}`;

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
            is_active: product.is_active,
          };
        });

        setTop5EndingProducts(transformedProducts);
      } catch (error) {
        console.error("❌ Lỗi khi fetch top 5 sản phẩm gần kết thúc:", error);
      }
    };

    fetchTop5EndingProducts();
  }, []);

  useEffect(() => {
    const fetchTop5MostBidProducts = async () => {
      try {
        const response = await productApi.getTop5MostBidded();
        // Transform backend data to match ProductCard props
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
          const remainingTime = `${String(diffHours).padStart(2, "0")}:${String(
            diffMinutes
          ).padStart(2, "0")}:${String(diffSeconds).padStart(2, "0")}`;
          // Format posted date
          const createdAt = new Date(product.created_at);
          const postedDate = `${String(createdAt.getDate()).padStart(
            2,
            "0"
          )}/${String(createdAt.getMonth() + 1).padStart(
            2,
            "0"
          )}/${createdAt.getFullYear()}`;
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
            is_active: product.is_active,
          };
        });

        setTop5MostBidProducts(transformedProducts);
      } catch (error) {
        console.error(
          "❌ Lỗi khi fetch top 5 sản phẩm có nhiều lượt ra giá nhất:",
          error
        );
      }
    };
    fetchTop5MostBidProducts();
  }, []);

  useEffect(() => {
    const fetchTop5HighestPriceProducts = async () => {
      try {
        const response = await productApi.getTop5HighestPrice();

        // Transform backend data to match ProductCard props
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
          const remainingTime = `${String(diffHours).padStart(2, "0")}:${String(
            diffMinutes
          ).padStart(2, "0")}:${String(diffSeconds).padStart(2, "0")}`;

          // Format posted date
          const createdAt = new Date(product.created_at);
          const postedDate = `${String(createdAt.getDate()).padStart(
            2,
            "0"
          )}/${String(createdAt.getMonth() + 1).padStart(
            2,
            "0"
          )}/${createdAt.getFullYear()}`;

          // Format price
          const formattedPrice = new Intl.NumberFormat("vi-VN").format(
            product.current_price
          );

          return {
            id: product.product_id,
            image: product.image_cover_url || electronicsImg,
            name: product.name,
            currentPrice: formattedPrice,
            highestBidder: "Đang cập nhật", // Backend chưa trả về
            buyNowPrice: product.buy_now_price
              ? new Intl.NumberFormat("vi-VN").format(product.buy_now_price)
              : null,
            postedDate: postedDate,
            remainingTime: remainingTime,
            bidCount: product.bid_count || 0, // Backend chưa trả về
            is_active: product.is_active,
          };
        });

        setTop5HighestPriceProducts(transformedProducts);
      } catch (error) {
        console.error(
          "❌ Lỗi khi fetch top 5 sản phẩm có giá cao nhất:",
          error
        );
      }
    };

    fetchTop5HighestPriceProducts();
  }, []);

  return (
    <>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          <div className="bg-linear-to-r from-blue-400 to-zinc-600 bg-clip-text text-transparent inline-block">
            Top 5 Sản Phẩm Sắp Kết Thúc Đấu Giá{" "}
          </div>

          <ClockFading className="inline-block w-6 h-6 text-zinc-500 ml-2 animate-bounce" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {top5EndingProducts.map((product, index) => (
            <ProductCard
              key={index}
              {...product}
              isInWatchlist={watchlistIds.has(product.id)}
            />
          ))}
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          <div className="bg-linear-to-r from-orange-400 to-red-600 bg-clip-text text-transparent inline-block">
            Top 5 Sản Phẩm Có Nhiều Lượt Ra Giá Nhất{" "}
          </div>

          <TrendingUp className="inline-block w-6 h-6 text-red-500 ml-2 animate-bounce" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {top5MostBidProducts.map((product, index) => (
            <ProductCard
              key={index}
              {...product}
              isInWatchlist={watchlistIds.has(product.id)}
            />
          ))}
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          <div className="bg-linear-to-r from-lime-400 to-green-600 bg-clip-text text-transparent inline-block">
            Top 5 Sản Phẩm Có Giá Cao Nhất{" "}
          </div>

          <BanknoteArrowUp className="inline-block w-6 h-6 text-green-500 ml-2 animate-bounce" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {top5HighestPriceProducts.map((product, index) => (
            <ProductCard
              key={index}
              {...product}
              isInWatchlist={watchlistIds.has(product.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductTopFives;
