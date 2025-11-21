import React from "react";
import WonAuctionCard from "./WonAuctionCard";

const mockWonProducts = [
  {
    id: "1",
    name: "iPhone 14 Pro 256GB",
    winningPrice: 21500000,
    sellerName: "Nguyễn Văn A",
  },
  {
    id: "2",
    name: "Laptop ASUS ROG Strix G15",
    winningPrice: 27500000,
    sellerName: "Shop Gaming B",
  },
  {
    id: "3",
    name: "Tai nghe AirPods Pro 2",
    winningPrice: 4200000,
    sellerName: "Minh Store",
  },
];

const WonAuction = ({ products = mockWonProducts }) => {
  return (
    <section className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Sản phẩm bạn đã thắng đấu giá
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Xem lại giá đã thắng và gửi đánh giá cho người bán.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-xs sm:text-sm px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Đã xác nhận thanh toán
        </span>
      </header>

      {products.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          Bạn chưa có sản phẩm nào thắng đấu giá.
        </p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.id}>
              <WonAuctionCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default WonAuction;
