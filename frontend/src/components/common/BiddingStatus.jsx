import { useEffect, useMemo, useState } from "react";
import { PiMedalFill } from "react-icons/pi";
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

const BiddingStatus = ({ className = "" }) => {
  const product = useProduct();
  const dispatch = useProductDispatch();

  // Create the formatter and format the number
  const formattedCurrentBid = formatNumberToCurrency(product.current_price);
  const formattedProductSteps = formatNumberToCurrency(product.steps);

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

  return (
    <>
      <main className={className}>
        <section>
          <h2 className="text-slate-400 text-md font-normal">CURRENT BID</h2>
          <p className="text-3xl font-semibold">{formattedCurrentBid} đ</p>
          <ProgressBar className="mt-2" />
        </section>
        <section className="mt-6 flex flex-row gap-2">
          <div className="">
            <img
              src={product.top_bidder.avatar_url}
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
              <span className="font-normal text-black ml-2">
                {product.top_bidder.name}
              </span>
            </p>
            <BidderRating
              className="w-fit"
              points={product.top_bidder.points}
            />
          </div>
        </section>
        <div className="w-full h-px bg-gray-400 mt-5 mb-2"></div>
        <section>
          {/* Steps label */}
          <Label value={formattedProductSteps} />
          <div className="flex flex-col gap-2">
            <div className="flex flex-col w-full gap-4 mx-auto my-3 justify-center align-center">
              {expired ? (
                <div className="bg-[#A1AFFF] text-white text-center rounded-3xl w-full py-1">
                  Sản phẩm đã đấu giá xong
                </div>
              ) : (
                <>                  
                  <BiddingForm
                    price={product.bidder.maximum_price}
                    steps={product.steps}
                  />

                  {/*If buy_now_price exists*/}
                  {buy_now && (
                    <NavigateButton
                      to={`/products/${product.product_id}/bidding`}
                      className="bg-linear-to-br from-blue-200 to-purple-400
                                 text-white text-center hover:from-blue-400 hover:to-purple-600
                                 font-bold rounded-md w-full py-2                                    
                                 relative group text-lg"
                    >
                      <p>
                        Mua ngay {formatNumberToCurrency(product.buy_now_price)}{" "}
                        đ
                      </p>
                      <span
                        className="absolute -top-1 -right-1 size-3 rounded-full bg-red-300 group-hover:bg-red-500 
                                        animate-ping"
                      ></span>
                      <span
                        className="absolute -top-1 -right-1 size-3 rounded-full bg-red-300 group-hover:bg-red-500
                                        "
                      ></span>
                    </NavigateButton>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default BiddingStatus;
