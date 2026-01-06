import { twMerge } from "tailwind-merge";
import { useState, useEffect, useReducer, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductGalleryCard from "./ProductGalleryCard";
import AuctionBidCard from "./AuctionBidCard";
import {
  ProductContext,
  ProductDispatchContext,
  productReducer,
} from "../../context/ProductDetailsContext";
import { productApi } from "../../api/product.api";
import ProductInfomation from "./ProductInfomation";
import { BlinkBlur } from "react-loading-indicators";
import ProductCard from "./ProductCard";
import ProductComments from "./ProductComments";
import { AiFillProduct } from "react-icons/ai";
import { formatNumberToCurrency } from "../../utils/NumberHandler";
import Spinner from "./Spinner";
import { Flame } from "lucide-react";
import { useSelector } from "react-redux";
import ErrorModal from "./ErrorModal";

const ProductDetails = () => {
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [product, dispatch] = useReducer(productReducer, {});
  const user = useSelector((state) => state.user);
  const isTopBidder =
    user.isLoggedIn && user.userData.id == product?.top_bidder?.id;

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const respone = await productApi.getProductById(params.id);
        //console.log(respone.data);
        if (isMounted) {
          dispatch({
            type: "load",
            payload: respone.data,
          });
        }
      } catch (err) {
        if (isMounted) setError(err);
        //console.error("Error loading product ", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  return (
    <>
      {isLoading && (
        <div className="h-screen w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {error && (
        <ErrorModal
          defaultMessage="Hệ thống đang gặp sự cố gián đoạn. Vui lòng kiểm tra kết nối mạng của bạn."
          error={error}
        />
      )}
      {!isLoading && !error && (
        <>
          {isTopBidder && (
            <div className="w-[80%] mx-auto mt-5 px-4 py-3 rounded-xl bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
              {/* Fire Icon with Yellow Fill for contrast */}
              <Flame
                className="text-yellow-200 fill-yellow-400 animate-pulse"
                size={24}
              />

              <span className="text-white font-bold text-base tracking-wide drop-shadow-sm">
                Sản phẩm bạn đang dẫn đầu
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-4 px-5 justify-center justify-items-center h-full w-full">
            <ProductContext.Provider value={product}>
              <ProductDispatchContext.Provider value={dispatch}>
                <ProductInfomation />
                <AuctionBidCard isTopBidder={isTopBidder} />
              </ProductDispatchContext.Provider>
            </ProductContext.Provider>
          </div>
          <div className="px-6">
            <h2
              className={twMerge(
                "flex flex-row gap-2 items-center  text-2xl font-bold mb-3",
                isTopBidder ? "text-orange-500" : "text-blue-500"
              )}
            >
              <AiFillProduct />
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 justify-start items-center">
              {product?.otherProducts?.length > 0 &&
                product.otherProducts.map((p, i) => {
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
                      key={i}
                      id={p.product_id}
                      name={p.name}
                      image={p.image_cover_url}
                      currentPrice={
                        formatNumberToCurrency(p.current_price) || -1
                      }
                      highestBidder={p?.top_bidder?.name || null}
                      buyNowPrice={
                        formatNumberToCurrency(p.buy_now_price) || -1
                      }
                      postedDate={`${String(
                        new Date(p.created_at).getDate()
                      ).padStart(2, "0")}/${String(
                        new Date(p.created_at).getMonth() + 1
                      ).padStart(2, "0")}/${new Date(
                        p.created_at
                      ).getFullYear()}`}
                      remainingTime={remainingTime}
                      bidCount={p.history_count}
                    />
                  );
                })}
            </div>
          </div>
          <ProductComments productId={params.id} isTopBidder={isTopBidder} />
        </>
      )}
    </>
  );
};

export default ProductDetails;
