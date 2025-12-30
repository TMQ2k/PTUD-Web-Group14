import { useEffect, useState } from "react";
import ProductCheckoutCard from "./ProductCheckoutCard"; // Adjust path as needed
import { Package } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userApi } from "../../api/user.api";
import { BlinkBlur } from "react-loading-indicators";
import { PackageOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCheckout = () => {
  const { userData } = useSelector((state) => state.user);
  const role = userData?.role || "guest";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userWonProducts, setUserWonProducts] = useState([]);

  // const data = [
  //   {
  //     productId: 1002,
  //     name: "Vintage 1960s Leica M3 Rangefinder Camera with Summicron 50mm Lens (Excellent Condition)",
  //     price: 2450.0,
  //     productImageUrl:
  //       "https://images.unsplash.com/photo-1627639685507-358459789474?q=80&w=2070&auto=format&fit=crop",
  //     seller: {
  //       name: "RetroOptics Ltd.",
  //       id: 12,
  //     },
  //     paymentQrUrl:
  //       "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BankTransfer:RetroOptics:ACC123456",
  //     status: "paid", // "invalid" - "sent" - "paid" - "received"
  //   },
  //   {
  //     productId: 1004,
  //     name: "Vintage 1960s Leica M3 Rangefinder Camera with Summicron 50mm Lens (Excellent Condition)",
  //     price: 2250.0,
  //     productImageUrl:
  //       "https://images.unsplash.com/photo-1627639685507-358459789474?q=80&w=2070&auto=format&fit=crop",
  //     seller: {
  //       name: "RetroOptics Ltd.",
  //       id: 11,
  //     },
  //     paymentQrUrl:
  //       "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BankTransfer:RetroOptics:ACC123456",
  //     status: "invalid", // "invalid" - "sent" - "paid" - "received"
  //   },
  // ];

  useEffect(() => {
    let isMounted = true;
    const loadUserWonProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const respone = await userApi.getUserWonProducts();
        if (isMounted) {
          setUserWonProducts(respone.data);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUserWonProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const onChangeStatus = async (wonId, status) => {
    const respone = await userApi.updateWonProductStatus(wonId ,status);
    return respone;
  }

  return (
    <>
      {loading && (
        <div className="h-screen w-full flex items-center justify-center">
          <BlinkBlur color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      )}
      {error && <div>{error}</div>}
      {!loading && !error && (
        <>
          {role === "guest" && <Navigate to="/" />}
          <h1 className="flex flex-row gap-2 justify-center items-center h-fit p-1 mt-4 text-center text-4xl font-bold text-transparent bg-linear-to-br from-blue-400 to-purple-600 bg-clip-text ">
            <Package className="size-12 stroke-purple-500 bg-purple-200 p-2 rounded-full" />
            Sản phẩm đã thắng
          </h1>
          <div className=" bg-gray-50 my-8 gap-8 flex flex-col justify-center items-center">
            {/* Render the card */}
            {(userWonProducts && userWonProducts.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border-2 border-dashed border-purple-100 mt-6">
                {/* Decorative Icon Circle */}
                <div className="bg-purple-50 p-6 rounded-full mb-4 animate-pulse">
                  <PackageOpen
                    className="h-16 w-16 text-purple-400"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Main Text */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  Bạn chưa thắng sản phẩm nào
                </h3>

                {/* Subtext */}
                <p className="text-gray-500 text-center max-w-md mb-8">
                  Có vẻ như bạn chưa tham gia đấu giá hoặc chưa chiến thắng
                  phiên nào. Hãy tìm kiếm món đồ yêu thích và bắt đầu đấu giá
                  ngay!
                </p>

                {/* Call to Action Button */}
                <Link
                  to="/"
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-purple-600 rounded-full shadow-md hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <span>Khám phá đấu giá</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              userWonProducts.map((p) => (
                <ProductCheckoutCard
                  key={p.product_id}
                  productName={p.product_name}
                  productImage={p.image_cover_url}
                  winningPrice={p.winning_bid}
                  sellerName={p.seller_name}
                  qrCodeUrl={p.seller_qr_url}
                  productId={p.productId}
                  status={p.status}
                  wonId={p.won_id}
                  onChangeStatus={onChangeStatus}
                />
              ))
            )}            
          </div>
        </>
      )}
    </>
  );
};

export default ProductCheckout;
