import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import SellerProductCheckoutCard from "./SellerProductCheckoutCard";
import { Package } from "lucide-react";
import { userApi } from "../../api/user.api";
import { BlinkBlur } from "react-loading-indicators";
import { Link } from "react-router-dom";
import { PackageOpen, ArrowRight } from "lucide-react";
import { productApi } from "../../api/product.api";

const SellerProductCheckout = () => {
  // const mockCheckoutData = [
  //   {
  //     productId: "prod_001",
  //     productName: "MacBook Pro 14-inch M3 Max - Space Black (32GB/1TB)",
  //     productImage:
  //       "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=1000&auto=format&fit=crop",
  //     wonId: "won_101",
  //     sellerName: "TechStore Official",
  //     sellerId: "sell_999",
  //     // Case 1: 'sent' - Buyer uploaded proof, waiting for you to process
  //     status: "sent",
  //     price: 45000000,
  //     transactionImage:
  //       "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop", // Bank transfer screenshot
  //   },
  //   {
  //     productId: "prod_002",
  //     productName: "Keychron Q1 Pro Mechanical Keyboard - Red Switch",
  //     productImage:
  //       "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop",
  //     wonId: "won_102",
  //     sellerName: "GearHunters",
  //     sellerId: "sell_888",
  //     // Case 2: 'invalid' - You rejected the previous proof
  //     status: "invalid",
  //     price: 3200000,
  //     transactionImage: null,
  //   },
  //   {
  //     productId: "prod_003",
  //     productName: "Sony WH-1000XM5 Noise Canceling Headphones",
  //     productImage:
  //       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
  //     wonId: "won_103",
  //     sellerName: "AudioPhile VN",
  //     sellerId: "sell_777",
  //     // Case 3: 'paid' - You confirmed money received, waiting for buyer to receive item
  //     status: "paid",
  //     price: 6490000,
  //     transactionImage:
  //       "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
  //   },
  //   {
  //     productId: "prod_004",
  //     productName: "Fujifilm X100V Digital Camera - Silver",
  //     productImage:
  //       "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
  //     wonId: "won_104",
  //     sellerName: "Camera World",
  //     sellerId: "sell_666",
  //     // Case 4: 'received' - Transaction fully completed
  //     status: "received",
  //     price: 32500000,
  //     transactionImage:
  //       "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
  //   },
  //   {
  //     productId: "prod_005",
  //     productName: "Herman Miller Aeron Chair - Size B",
  //     productImage:
  //       "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop",
  //     wonId: "won_105",
  //     sellerName: "Office Setup",
  //     sellerId: "sell_555",
  //     // Case 5: Another 'sent' case to test layout with multiple active items
  //     status: "sent",
  //     price: 18000000,
  //     transactionImage:
  //       "https://images.unsplash.com/photo-1621981386829-9b747d6a9f9d?q=80&w=1000&auto=format&fit=crop",
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

  const onPaid = async (wonId, productId) => {
    const respone = await productApi.getWinningBidder(productId);
    return respone.data;
  };
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
                  Có vẻ như bạn chưa đăng sản phẩm hoặc sản phẩm đã đăng nhưng
                  chưa hết thời gian đấu giá!
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

            {/* <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen items-center">
              {mockCheckoutData.map((item) => (
                <SellerProductCheckoutCard
                  key={item.wonId}
                  {...item} // Spread all data properties
                  onChangeStatus={onChangeStatus}
                  onPaid={() => console.log("Paid clicked")}
                />
              ))}
            </div> */}
          </div>
        </>
      )}
    </>
  );
};

export default SellerProductCheckout;
