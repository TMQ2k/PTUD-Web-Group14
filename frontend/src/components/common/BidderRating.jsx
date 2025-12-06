import { twMerge } from "tailwind-merge"
import { AiFillLike } from "react-icons/ai";

const BidderRating = ({ points=0, className="" }) => {
  return (
    <div className={twMerge(`bg-sky-500/60 px-3 rounded-sm text-black/70 font-bold
                    flex flex-row align-center gap-1`, className)}>
      <AiFillLike className="self-center"/>
      <p>+{points}</p>
    </div> 
  )
}

export default BidderRating