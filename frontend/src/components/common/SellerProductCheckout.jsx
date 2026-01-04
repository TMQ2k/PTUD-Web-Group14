import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import SellerProductCheckoutCard from "./SellerProductCheckoutCard";
import { Package } from "lucide-react";
import { userApi } from "../../api/user.api";
import { BlinkBlur } from "react-loading-indicators";
import { Link } from "react-router-dom";
import { PackageOpen, ArrowRight } from "lucide-react";

const SellerProductCheckout = () => {
  // const data = [
  //   {
  //     productId: 1004,
  //     name: "Vintage 1960s Leica M3 Rangefinder Camera with Summicron 50mm Lens (Excellent Condition)",
  //     price: 2250.0,
  //     productImageUrl:
  //       "https://images.unsplash.com/photo-1627639685507-358459789474?q=80&w=2070&auto=format&fit=crop",
  //     bidderImageUrl:
  //       "https://inkythuatso.com/uploads/thumbnails/800/2023/03/hinh-anh-chuyen-tien-thanh-cong-vietcombank-1-07-12-28-47.jpg",
  //     seller: {
  //       name: "RetroOptics Ltd.",
  //       id: 11,
  //     },
  //     bidder: {
  //       username: "thienphu",
  //       email: "truongcongthienphu1910@gmai.com",
  //       address: "227 Nguyễn Văn Cừ",
  //     },
  //     status: "sent", // "invalid" - "sent" - "paid" - "received"
  //   },
  //   {
  //     productId: 1004,
  //     name: "Vintage 1960s Leica M3 Rangefinder Camera with Summicron 50mm Lens (Excellent Condition)",
  //     price: 2250.0,
  //     productImageUrl:
  //       "https://images.unsplash.com/photo-1627639685507-358459789474?q=80&w=2070&auto=format&fit=crop",
  //     transactionImageUrl: null,
  //     seller: {
  //       name: "RetroOptics Ltd.",
  //       id: 11,
  //     },
  //     bidder: {
  //       username: "thienphu",
  //       email: "truongcongthienphu1910@gmai.com",
  //       address: "227 Nguyễn Văn Cừ",
  //     },
  //     status: "invalid", // "invalid" - "sent" - "paid" - "received"
  //   },
  // ];

  const { userData } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userWonProducts, setUserWonProducts] = useState([]);

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

  const onPaid = async (wonId, productId) => {};
  const onChangeStatus = async (wonId, status) => {
    const respone = await userApi.updateWonProductStatus(wonId, status);
    return respone;
  };

  return (
    <>
      {loading && (
        <div className="h-screen w-full flex items-center justify-center">
          <BlinkBlur color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      )}
      {error && <div>{error?.message}</div>}
      {!loading && !error && (
        <>
          <h1 className="flex flex-row gap-2 justify-center items-center h-fit p-1 mt-4 ml-4 text-4xl font-bold text-transparent bg-linear-to-br from-amber-400 to-red-600 bg-clip-text ">
            <Package className="size-12 stroke-red-500 bg-red-200 p-2 rounded-full" />
            Sản phẩm của bạn đang chờ xử lý
          </h1>
          <div className="flex flex-col justify-center items-center gap-4 my-4">
            {userWonProducts && userWonProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border-2 border-dashed border-amber-100 mt-6">
                {/* Decorative Icon Circle */}
                <div className="bg-amber-50 p-6 rounded-full mb-4 animate-pulse">
                  <PackageOpen
                    className="h-16 w-16 text-amber-400"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Main Text */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  Sản phẩm của bạn chưa có người chiến thắng
                </h3>

                {/* Subtext */}
                <p className="text-gray-500 text-center max-w-md mb-8">
                  Có vẻ như bạn chưa đăng sản phẩm hoặc sản phẩm đã đăng nhưng chưa hết thời gian đấu giá!                  
                </p>

                {/* Call to Action Button */}
                <Link
                  to="/"
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-amber-600 rounded-full shadow-md hover:bg-amber-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <span>Khám phá đấu giá</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              userWonProducts.map((p) => (
                <SellerProductCheckoutCard
                  productId={p.product_id}
                  wonId={p.won_id}
                  productName={p.product_name}
                  productImage={p.image_cover_url}
                  sellerName={p.seller_name}
                  sellerId={userData.id}
                  onPaid={onPaid}
                  transactionImage={p.payment}
                  price={p.winning_bid}
                  status={p.status}
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

export default SellerProductCheckout;
