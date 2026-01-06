import { twMerge } from "tailwind-merge"

const TimeCard = ({ value, name, className="" }) => {
  return (
    <div className={twMerge("text-center w-1/4", className)}>
      <div className="rounded-lg w-full border border-white/20 bg-white/16 py-1">
        <h1 className="text-white font-normal text-lg">{value}</h1>
      </div>
      <h3 className="text-white/70 font-normal text-sm uppercase">{name}</h3>
    </div>
  )
}

export default TimeCard