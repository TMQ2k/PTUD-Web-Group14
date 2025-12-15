import TimeCountDown from "./TimeCountDown";
import ProgressBar from "./ProgressBar";
import BiddingStatus from "./BiddingStatus";
//import { useProduct } from "../../context/ProductDetailContext";

const AuctionBidCard = () => { 
  //const product = useProduct();
  //const expired_date = new Date(product.end_time);
  
  return (
    <>
      <main className="sticky inset-y-21 h-fit w-[70%] shadow-2xl font-bold rounded-lg">
        <header className="bg-linear-to-br from-blue-400 to-purple-600
                           rounded-t-lg text-white text-center w-full pb-2">          
          <TimeCountDown />          
        </header>
        <article>
          <BiddingStatus className="px-4 py-2" />
        </article>
      </main>
    </>
  );
}

export default AuctionBidCard