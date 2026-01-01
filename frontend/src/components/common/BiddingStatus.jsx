import { useEffect, useMemo, useState, Activity } from "react";
import { PiMedalFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import {
  useProduct,
  useProductDispatch,
} from "../../context/ProductDetailsContext";
import { isExpired } from "../../utils/DateTimeCalculation";
import { formatNumberToCurrency } from "../../utils/NumberHandler";
import BidderRating from "./BidderRating";
import ProgressBar from "./ProgressBar";
import Label from "./Label";
import NavigateButton from "./NavigateButton";
import BiddingForm from "./BiddingForm";
import default_image from "../../../public/images/default/unavailable_item.jpeg";
import { useNavigate } from "react-router-dom";
import { bidderApi } from "../../api/bidder.api";
import { FaShippingFast } from "react-icons/fa";
import BiddingRequestForm from "./BiddingRequestForm";

const BiddingStatus = ({ className = "" }) => {
  const navigate = useNavigate();
  const product = useProduct();
  const dispatch = useProductDispatch();
  const { userData } = useSelector((state) => state.user);
  console.log(userData);
  const role = userData?.role || "guest";
  //console.log("Role: ", role)
  const rating_percent = userData?.rating_percent || 0.0;
  //console.log(userData.id !== product.seller.id)

  // Create the formatter and format the number
  const formattedCurrentBid = formatNumberToCurrency(
    product.current_price || product.starting_price
  );
  const formattedProductSteps = formatNumberToCurrency(product.step_price);

  const [expired, setExpired] = useState(false);

  const buy_now = useMemo(() => {
    return product.buy_now_price;
  }, [product.buy_now_price]);

  useEffect(() => {
    const interval_id = setInterval(() => {
      if (isExpired(product.end_time)) {
        setExpired(true);
      }
    });

    return () => {
      clearInterval(interval_id);
    };
  }, [product.end_time]);

  useEffect(() => {

  }, [])

  const [isBidOnProduct, setBidOnProduct] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadIsBidOnProduct = async () => {
      try {
        const respone = await bidderApi.isBidOnProduct(product.product_id);
        if (isMounted) setBidOnProduct(respone.data.fnc_is_bids);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (userData.id !== product.seller.id) loadIsBidOnProduct();

    return () => {
      isMounted = false;
    };
  }, [product.product_id, userData.id, product.seller.id]);

  const handleAutobidUpdate = async () => {
    const respone = await bidderApi.autobidUpdate(product?.product_id);
    dispatch({
      type: "autobid-update",
      payload: respone.data,
    });
  };

  return (
    <>        
      <main className={className}>
        <section>
          <h2 className="text-slate-400 text-md font-normal uppercase">
            {product?.current_price && product?.top_bidder
              ? "Giá hiện tại"
              : "Giá khởi điểm"}
          </h2>
          <p className="text-3xl font-semibold">{formattedCurrentBid} đ</p>
          <ProgressBar className="mt-2" />
        </section>
        <section className="mt-6 flex flex-row gap-2">
          {product?.top_bidder ? (
            <>
              <div className="">
                <img
                  src={product?.top_bidder?.avatar_url || default_image}
                  alt="Highest payed Bidder"
                  className="rounded-full object-cover w-24 h-24 border border-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 align-center">
                  <PiMedalFill className="fill-amber-400 size-5 self-end" />
                  <p className="text-amber-300">Leading Bidder</p>
                </div>
                <p className="font-bold text-xl text-blue-700">
                  Bidder:
                  <span className="text-black font-semibold ml-2">
                    {product?.top_bidder?.username || "********"}
                  </span>
                </p>
                <BidderRating
                  className="w-fit"
                  points={product?.top_bidder?.points || "NaN"}
                />
              </div>
            </>
          ) : (
            <div className="font-bold text-red-500 text-center w-full">
              Sản phẩm chưa có người đấu giá
            </div>
          )}
        </section>
        <div className="w-full h-px bg-gray-400 mt-5 mb-2"></div>
        <section>
          <Label value={formattedProductSteps} />
          <div className="flex flex-col gap-2">
            <div className="flex flex-col w-full gap-4 mx-auto my-3 justify-center align-center">
              {expired ? (
                <div className="bg-none text-red-500 text-xl text-center rounded-lg w-full py-1">
                  Sản phẩm đã đấu giá xong
                </div>
              ) : (
                <>
                  {(role === "bidder" ||
                    (role === "seller" &&
                      product?.seller?.id &&
                      userData?.id &&
                      userData.id !== product.seller.id)) && (
                    <>
                      {rating_percent < 80.0 && !isBidOnProduct ? (
                        <BiddingRequestForm
                          productId={product?.product_id || ""}
                          state={false}
                        />
                      ) : (
                        <>
                          <BiddingForm
                            price={product?.bidder?.maximum_price || 0}
                            steps={parseInt(product?.step_price) || 0}
                            productId={product?.product_id || ""}
                            onAutobidUpdate={handleAutobidUpdate}
                          />
                          {buy_now && (
                            <NavigateButton
                              to={`/products/${
                                product?.product_id || ""
                              }/bidding`}
                              className="bg-white/50 hover:bg-purple-100
                                       text-center text-purple-500
                                       font-bold rounded-md w-full py-2                                    
                                       relative group text-lg border-2 border-purple-500"
                            >
                              <p className="flex flex-row justify-center items-center gap-2">
                                <FaShippingFast className="size-6" />
                                Mua ngay{" "}
                                {formatNumberToCurrency(
                                  product?.buy_now_price || "NaN"
                                )}{" "}
                                đ
                              </p>
                              <span
                                className="absolute -top-2 -right-2 size-3 rounded-full bg-pink-300 group-hover:bg-pink-500 
                                        animate-ping"
                              ></span>
                              <span
                                className="absolute -top-2 -right-2 size-3 rounded-full bg-pink-300 group-hover:bg-pink-500
                                        "
                              ></span>
                            </NavigateButton>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
              <button
                className="bg-linear-to-br from-[#8711c1] to-[#2472fc] px-4 py-2 rounded-xl text-center text-white relative group hover:scale-102 cursor-pointer transition-all duration-200"
                onClick={() => {
                  navigate(`/auctionmanagement/${product?.product_id}`, {
                    state: {
                      sellerId: product?.seller?.id || null,
                      productName: product?.name || "",
                    },
                  });
                }}
              >

                {role === "seller" &&
                product?.seller?.id &&
                userData?.id &&
                userData.id === product.seller.id
                  ? "Quản lý đấu giá"
                  : "Lịch sử đấu giá"}
                <span
                  className="absolute -top-1 -right-1 size-3 rounded-full bg-orange-500
                              animate-ping"
                ></span>
                <span
                  className="absolute -top-1 -right-1 size-3 rounded-full bg-orange-500
                              "
                ></span>
              </button>
            </div>
          </div>
        </section>
      </main>      
    </>
  );
};

export default BiddingStatus;
