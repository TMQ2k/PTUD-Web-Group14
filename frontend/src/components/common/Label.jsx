import { twMerge } from "tailwind-merge"

const Label = ({ value=0, className="" }) => {
  return (
    <div className={twMerge(`flex flex-row align-center justify-between bg-sky-100 rounded-xl
                    py-2 px-4 text-sm w-full`, className)}>
      <p className="font-normal text-slate-800">
        Bước nhảy: 
      </p>
      <p className="font-bold text-blue-500">
        {value} đ
      </p>
    </div>
  );
}

export default Label;