import TimeCountDown from "./TimeCountDown";
import ProgressBar from "./ProgressBar";
import BiddingStatus from "./BiddingStatus";
import { twMerge } from "tailwind-merge";
//import { useProduct } from "../../context/ProductDetailContext";

const AuctionBidCard = ({ isTopBidder }) => {
  //const product = useProduct();
  //const expired_date = new Date(product.end_time);

  return (
    <>
      <main className="md:sticky overflow-hidden inset-y-21 max-h-140 h-fit w-full pr-1 md:w-[80%] shadow-2xl font-bold rounded-lg ">
        <header
          className={twMerge(
            `bg-linear-to-br 
                           rounded-t-lg text-white text-center w-full pb-2`,
            isTopBidder
              ? "from-orange-400 to-red-600"
              : "from-blue-400 to-purple-600"
          )}
        >
          <TimeCountDown />
        </header>
        <article
          className={twMerge(
            `overflow-y-auto max-h-113 h-fit overflow-x-hidden
                            [&::-webkit-scrollbar]:w-2
                            
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            `,
            isTopBidder
              ? `[&::-webkit-scrollbar-track]:bg-orange-50 [&::-webkit-scrollbar-thumb]:bg-orange-200
                  hover:[&::-webkit-scrollbar-thumb]:bg-orange-400`
              : `[&::-webkit-scrollbar-track]:bg-blue-50 [&::-webkit-scrollbar-thumb]:bg-blue-200
                hover:[&::-webkit-scrollbar-thumb]:bg-blue-400`
          )}
        >
          <BiddingStatus className="px-4 py-2" />
        </article>
      </main>
    </>
  );
};

export default AuctionBidCard;
