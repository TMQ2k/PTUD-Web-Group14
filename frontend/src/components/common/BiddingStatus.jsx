import { twMerge } from "tailwind-merge";
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
import default_image from "../../../public/images/default/default_avatar.jfif";
import { useNavigate } from "react-router-dom";
import { bidderApi } from "../../api/bidder.api";
import { FaShippingFast } from "react-icons/fa";
import BiddingRequestForm from "./BiddingRequestForm";
import BuyNowDialog from "./BuyNowDialog";
import AutoBidDialog from "./AutoBidDialog";
import { Zap } from "lucide-react";
import { Lock } from "lucide-react";
import { Sparkles } from "lucide-react";

const BiddingStatus = ({ className = "" }) => {
  const navigate = useNavigate();
  const product = useProduct();
  const dispatch = useProductDispatch();
  const user = useSelector((state) => state.user);
  const { userData } = user.isLoggedIn ? user : {};
  const role = user.isLoggedIn ? user.userData.role : "guest";
  const rating_percent = userData?.rating_percent || 0.0;
  const isTopBidder =
    user.isLoggedIn && user.userData.id == product?.top_bidder?.id;
  // Create the formatter and format the number
  const formattedCurrentBid = formatNumberToCurrency(
    product.current_price || product.starting_price
  );
  const formattedProductSteps = formatNumberToCurrency(product.step_price);

  const [expired, setExpired] = useState(false);
  const [bidPrice, setBidPrice] = useState(0.0);

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

  useEffect(() => {}, []);

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

    if (user.isLoggedIn && userData?.id !== product.seller.id)
      loadIsBidOnProduct();

    return () => {
      isMounted = false;
    };
  }, [user.isLoggedIn, product.product_id, userData?.id, product.seller.id]);

  // const handleAutobidUpdate = async () => {
  //   try {
  //     const respone = await bidderApi.autobidUpdate(product?.product_id);
  //     dispatch({
  //       type: "autobid-update",
  //       payload: respone.data,
  //     });
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  const onAutoBid = async (productId, formattedPrice) => {
    try {
      const respone = await bidderApi.autobid(productId, formattedPrice);
      if (respone.code === 200) {
        const updateRespone = await bidderApi.autobidUpdate(
          product?.product_id
        );
        dispatch({
          type: "autobid-update",
          payload: updateRespone.data,
        });
      }

      return respone;
    } catch (err) {
      console.log(err.message);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openBuyDialog = () => setIsDialogOpen(true);
  const closeBuyDialog = () => setIsDialogOpen(false);

  const [isAutoBidDialogOpen, setIsAutoBidDialogOpen] = useState(false);

  const openAutoBidDialog = () => setIsAutoBidDialogOpen(true);
  const closeAutoBidDialog = () => setIsAutoBidDialogOpen(false);

  const handleAutoBidConfirm = async (productId, price) => {
    try {
      console.log(price);
      await onAutoBid(productId, price);
    } catch (err) {
      console.log(err.message);
    }
    closeAutoBidDialog();
    alert("Autobid confirmed!");
  };

  // The actual action to take when they click "Buy Now" in the dialog
  const handlePurchaseConfirm = async (productId) => {
    console.log(`Processing purchase for Product ID: ${productId}...`);

    const respone = await bidderApi.buyNow(productId);
    if (respone?.code === 200) {
      navigate("/productcheckout");
    }
    closeBuyDialog();
    alert("Purchase confirmed!");
  };

  const suggest_price =
    parseInt(product?.current_price) + parseInt(product?.step_price);

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
          <ProgressBar isTopBidder={isTopBidder} className="mt-2" />
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
            <div className="w-full bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center justify-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-100" />

              <span className="text-sm font-semibold text-indigo-700">
                Chưa có ai đặt giá.{" "}                
              </span>
            </div>
          )}
        </section>
        <div className="w-full h-px bg-gray-400 mt-5 mb-2"></div>
        <section>
          <Label isTopBidder={isTopBidder} value={formattedProductSteps} />
          <div className="flex flex-col gap-2">
            <div className="flex flex-col w-full gap-4 mx-auto my-3 justify-center align-center">
              {expired ? (
                <div className="w-full bg-slate-100 border border-slate-200 rounded-lg py-3 px-4 flex items-center justify-center gap-2">
      <Lock className="w-5 h-5 text-slate-500" />
      <span className="font-semibold text-slate-600">
        Phiên đấu giá đã kết thúc
      </span>
    </div>
              ) : (
                <>
                  {(role === "bidder" ||
                    (role === "seller" &&
                      product?.seller?.id &&
                      userData?.id &&
                      userData.id !== product.seller.id)) && (
                    <>
                      {rating_percent < 80.0 || !isBidOnProduct ? (
                        <BiddingRequestForm
                          productId={product?.product_id || ""}
                          state={false}
                        />
                      ) : (
                        <>
                          <div className="w-full flex items-center justify-between gap-3 p-2 rounded-xl bg-orange-50/50 border border-orange-100">
                            {/* Label Section */}
                            <div className="flex items-center gap-1.5 text-orange-800 font-semibold text-sm pl-1">
                              <Zap
                                size={16}
                                className="fill-orange-500 text-orange-500"
                              />
                              <span className="whitespace-nowrap">
                                Đấu giá nhanh
                              </span>
                            </div>

                            {/* Button Section */}
                            <button
                              className="flex-1 max-w-[180px] text-sm font-bold py-2 px-3 rounded-lg 
                                        bg-white text-orange-600 border border-orange-200 shadow-sm
                                        hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-orange-200 hover:shadow-md
                                        active:scale-95 transition-all duration-300"
                              onClick={() => {
                                setBidPrice(suggest_price);
                                openAutoBidDialog();
                              }}
                            >
                              {formatNumberToCurrency(suggest_price)} đ
                            </button>
                          </div>
                          <BiddingForm
                            price={product?.bidder?.maximum_price || 0}
                            steps={parseInt(product?.step_price) || 0}
                            productId={product?.product_id || ""}
                            endTime={product.end_time}
                            buyNowPrice={product?.buy_now_price || null}
                            setAutoBidPrice={setBidPrice}
                            openBuyDialog={openBuyDialog}
                            openAutoBidDialog={openAutoBidDialog}
                            onAutoBid={onAutoBid}
                          />

                          {buy_now && (
                            <>
                              <button
                                className="bg-white/50 hover:bg-purple-100
                                       text-center text-purple-500
                                       font-bold rounded-md w-full py-2                                    
                                       relative group text-lg border-2 border-purple-500"
                                onClick={openBuyDialog}
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
                              </button>
                              <BuyNowDialog
                                isOpen={isDialogOpen}
                                onClose={closeBuyDialog}
                                onConfirm={handlePurchaseConfirm}
                                buyNowPrice={product.buy_now_price}
                                productId={product.product_id}
                              />
                              <AutoBidDialog
                                isOpen={isAutoBidDialogOpen}
                                onClose={closeAutoBidDialog}
                                onConfirm={handleAutoBidConfirm}
                                price={bidPrice}
                                productId={product.product_id}
                              />
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
              <button
                className={twMerge(
                  "bg-linear-to-br px-4 py-2 rounded-xl text-center text-white relative group hover:scale-102 cursor-pointer transition-all duration-200",
                  isTopBidder
                    ? "from-red-600 to-orange-400"
                    : "from-[#8711c1] to-[#2472fc]"
                )}
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
