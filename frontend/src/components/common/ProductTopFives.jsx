import React, { use } from "react";
import ProductCard from "./ProductCard";
import { TrendingUp, ClockFading, BanknoteArrowUp } from "lucide-react";
//test image
import electronicsImg from "../../assets/electronics.jpg";
import { useEffect, useState } from "react";
import { productApi } from "../../api/product.api";

const products = [
  // 🕒 Top 5 gần kết thúc
  {
    id: 1,
    image: electronicsImg,
    name: "Đồng hồ cơ Orient Bambino Gen 4",
    currentPrice: "2,450,000",
    highestBidder: "Van Cong Khoa",
    buyNowPrice: "3,200,000",
    postedDate: "05/11/2025",
    remainingTime: "00:04:32",
    bidCount: 12,
  },
  {
    id: 2,
    image: electronicsImg,
    name: "iPhone 15 Pro Max 256GB - Titan Blue",
    currentPrice: "31,200,000",
    highestBidder: "Nguyen Hoang",
    buyNowPrice: "33,000,000",
    postedDate: "06/11/2025",
    remainingTime: "00:09:15",
    bidCount: 15,
  },
  {
    id: 3,
    image: electronicsImg,
    name: "Tai nghe Sony WH-1000XM5",
    currentPrice: "5,200,000",
    highestBidder: "Le Bao Anh",
    buyNowPrice: "6,000,000",
    postedDate: "06/11/2025",
    remainingTime: "00:02:10",
    bidCount: 9,
  },
  {
    id: 4,
    image: electronicsImg,
    name: "Giày Nike Air Jordan 1 Retro High OG",
    currentPrice: "6,500,000",
    highestBidder: "Tran Thi Nhi",
    buyNowPrice: "7,800,000",
    postedDate: "05/11/2025",
    remainingTime: "00:07:45",
    bidCount: 22,
  },
  {
    id: 5,
    image: electronicsImg,
    name: "Túi xách LV Capucines BB màu hồng",
    currentPrice: "42,000,000",
    highestBidder: "Pham Hoai Nam",
    buyNowPrice: "45,000,000",
    postedDate: "03/11/2025",
    remainingTime: "00:01:59",
    bidCount: 30,
  },

  // 💬 Top 5 có nhiều lượt ra giá nhất
  {
    id: 6,
    image: electronicsImg,
    name: "Máy ảnh Canon EOS R6 Mark II (Kit RF 24-105mm)",
    currentPrice: "33,500,000",
    highestBidder: "Do Thi Yen",
    buyNowPrice: "36,000,000",
    postedDate: "04/11/2025",
    remainingTime: "02:15:10",
    bidCount: 45,
  },
  {
    id: 7,
    image: electronicsImg,
    name: "MacBook Air M2 2023 13 inch 8GB/256GB",
    currentPrice: "22,900,000",
    highestBidder: "Nguyen Quoc Bao",
    buyNowPrice: "25,000,000",
    postedDate: "02/11/2025",
    remainingTime: "03:20:00",
    bidCount: 42,
  },
  {
    id: 8,
    image: electronicsImg,
    name: "iPad Pro 2022 M2 11 inch Wi-Fi 128GB",
    currentPrice: "18,200,000",
    highestBidder: "Le Thi My",
    buyNowPrice: "20,000,000",
    postedDate: "01/11/2025",
    remainingTime: "05:00:00",
    bidCount: 39,
  },
  {
    id: 9,
    image: electronicsImg,
    name: "Đàn Guitar Fender Player Stratocaster",
    currentPrice: "14,800,000",
    highestBidder: "Pham Nhat Tan",
    buyNowPrice: "16,500,000",
    postedDate: "03/11/2025",
    remainingTime: "04:10:20",
    bidCount: 37,
  },
  {
    id: 10,
    image: electronicsImg,
    name: "Nhẫn Kim Cương PNJ 18K - Classic Collection",
    currentPrice: "56,000,000",
    highestBidder: "Tran Minh Hieu",
    buyNowPrice: "60,000,000",
    postedDate: "05/11/2025",
    remainingTime: "02:55:55",
    bidCount: 50,
  },

  // 💰 Top 5 có giá cao nhất
  {
    id: 11,
    image: electronicsImg,
    name: "Mercedes-Benz C200 AMG 2024",
    currentPrice: "1,850,000,000",
    highestBidder: "Le Minh Quan",
    buyNowPrice: null,
    postedDate: "01/11/2025",
    remainingTime: "12:30:00",
    bidCount: 8,
  },
  {
    id: 12,
    image: electronicsImg,
    name: "Ducati Panigale V4S 2023",
    currentPrice: "950,000,000",
    highestBidder: "Pham Gia Kiet",
    buyNowPrice: "1,000,000,000",
    postedDate: "02/11/2025",
    remainingTime: "10:20:00",
    bidCount: 15,
  },
  {
    id: 13,
    image: electronicsImg,
    name: "Drone DJI Inspire 3 - Premium Cinematic Kit",
    currentPrice: "320,000,000",
    highestBidder: "Nguyen Bao Trung",
    buyNowPrice: null,
    postedDate: "04/11/2025",
    remainingTime: "08:45:00",
    bidCount: 22,
  },
  {
    id: 14,
    image: electronicsImg,
    name: "Nước hoa Creed Aventus 100ml - Limited Edition",
    currentPrice: "8,500,000",
    highestBidder: "Hoang Bao Chau",
    buyNowPrice: "9,500,000",
    postedDate: "05/11/2025",
    remainingTime: "09:15:00",
    bidCount: 17,
  },
  {
    id: 15,
    image: electronicsImg,
    name: "Tivi OLED LG 65 inch 4K Smart TV 2024",
    currentPrice: "48,000,000",
    highestBidder: "Vu Ngoc Mai",
    buyNowPrice: "52,000,000",
    postedDate: "06/11/2025",
    remainingTime: "07:00:00",
    bidCount: 26,
  },
];

const ProductTopFives = () => {
  const [top5HighestPriceProducts, setTop5HighestPriceProducts] = useState([]);
  const [top5EndingProducts, setTop5EndingProducts] = useState([]);
  const [top5MostBidProducts, setTop5MostBidProducts] = useState([]);

  // const top5EndingProducts = products
  //   .sort((a, b) => {
  //     const timeA = a.remainingTime.split(":").map(Number);
  //     const timeB = b.remainingTime.split(":").map(Number);
  //     const totalSecondsA = timeA[0] * 3600 + timeA[1] * 60 + timeA[2];
  //     const totalSecondsB = timeB[0] * 3600 + timeB[1] * 60 + timeB[2];
  //     return totalSecondsA - totalSecondsB;
  //   })
  //   .slice(0, 5);

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
            <ProductCard key={index} {...product} />
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
            <ProductCard key={index} {...product} />
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
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductTopFives;
