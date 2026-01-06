import { twMerge } from "tailwind-merge"

const Label = ({ value=0, isTopBidder, className="" }) => {
  return (
    <div className={twMerge(`flex flex-row align-center justify-between bg-sky-100 rounded-xl
                    py-2 px-4 text-sm w-full`,
                    isTopBidder ? "bg-amber-100" : "bg-sky-100",
                    className)}>
      <p className="font-semibold text-slate-800">
        Bước nhảy: 
      </p>
      <p className={twMerge("font-bold", isTopBidder ? "text-orange-500" : "text-blue-500")}>
        {value} đ
      </p>
    </div>
  );
}

export default Label;