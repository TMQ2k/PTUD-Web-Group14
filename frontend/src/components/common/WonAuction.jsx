import React, { useState, useEffect } from "react";
import WonAuctionCard from "./WonAuctionCard";
import { userApi } from "../../api/user.api";
import { toast } from "react-toastify";

const WonAuction = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWonProducts();
  }, []);

  const fetchWonProducts = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUserWonProducts();
      const wonProducts = response.data || [];

      // Transform data to match component format
      const transformedProducts = wonProducts.map((item) => ({
        wonId: item.won_id,
        productId: item.product_id,
        name: item.product_name,
        winningPrice: parseFloat(item.winning_bid),
        image: item.image_cover_url,
        sellerId: item.seller_id,
        sellerName: item.seller_name?.trim() || "Không rõ",
        sellerQrUrl: item.seller_qr_url,
        status: item.status,
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm đã thắng:", error);
      toast.error("Không thể tải danh sách sản phẩm đã thắng");
    } finally {
      setLoading(false);
    }
  };
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
      </header>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-2">Đang tải...</p>
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          Bạn chưa có sản phẩm nào thắng đấu giá.
        </p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.wonId}>
              <WonAuctionCard
                product={product}
                onRatingSuccess={fetchWonProducts}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default WonAuction;
