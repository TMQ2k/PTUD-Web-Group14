import { useState, useEffect } from "react";
import { productApi } from "../../api/product.api";
import { formatNumberToCurrency } from "../../utils/NumberHandler";

const PostedProducts = () => {
  const [postedProducts, setPostedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadPostedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const respone = await productApi.getSellerProducts();
        if (isMounted) {
          setPostedProducts(respone?.data || []);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPostedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {!loading &&
        !error &&
        (!postedProducts || postedProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">
              Sản phẩm đã đăng & còn hạn
            </h2>
            <p className="text-gray-600">
              Danh sách sản phẩm đang trong thời gian đấu giá...
            </p>
            {/* TODO: Thêm danh sách sản phẩm */}
          </div>
        ) : (
          postedProducts.map((p) => {
            const endTime = new Date(p.end_time);
            const now = new Date();
            const diffMs = endTime - now;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor(
              (diffMs % (1000 * 60 * 60)) / (1000 * 60)
            );
            const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
            const remainingTime = `${String(diffHours).padStart(
              2,
              "0"
            )}:${String(diffMinutes).padStart(2, "0")}:${String(
              diffSeconds
            ).padStart(2, "0")}`;
            return (
              <ProductCard
                key={p.product_id}
                id={p.product_id}
                name={p.name}
                image={p.image_cover_url}
                currentPrice={formatNumberToCurrency(p.current_price) || -1}
                highestBidder={p?.top_bidder?.name || null}
                buyNowPrice={formatNumberToCurrency(p.buy_now_price) || -1}
                postedDate={`${String(
                  new Date(p.created_at).getDate()
                ).padStart(2, "0")}/${String(
                  new Date(p.created_at).getMonth() + 1
                ).padStart(2, "0")}/${new Date(p.created_at).getFullYear()}`}
                remainingTime={remainingTime}
                bidCount={p.history_count}
              />
            );
          })
        ))}
    </>
  );
};

export default PostedProducts;
