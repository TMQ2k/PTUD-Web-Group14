import { useEffect, useState } from "react";
import { useProduct } from "../../context/ProductDetailsContext";
import { remainingTime, isExpired } from "../../utils/DateTimeCalculation";
import TimeCard from "./TimeCard";

const TimeCountDown = () => {
  const product = useProduct();

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [expired, setExpired] = useState(false);

  const { end_time } = product;

  useEffect(() => {
    const startCountdown = () => {
      const remaining_time = remainingTime(end_time);
      setTime({
        days: remaining_time.day_remaining,
        hours: remaining_time.hour_remaining,
        minutes: remaining_time.minute_remaining,
        seconds: remaining_time.second_remaining,
      });
    };

    const interval_id = setInterval(() => {
      if (isExpired(end_time)) {
        setExpired(true);
      } else startCountdown();
    }, 1000);

    return () => {
      clearInterval(interval_id);
    };
  }, [end_time]);

  return (
    <>
      {expired ? (
        <div className="text-white text-2xl pt-2 pb-1 uppercase">
          Hết thời gian đấu giá
        </div>
      ) : (
        <>
          <p className="rounded-t-lg text-md text-slate-200 py-2">
            Phiên đấu giá còn
          </p>
          <div className="flex flex-row justify-center items-center gap-2 px-2">
            <TimeCard value={time.days} name="days" />
            <TimeCard value={time.hours} name="hours" />
            <TimeCard value={time.minutes} name="minutes" />
            <TimeCard value={time.seconds} name="seconds" />
          </div>
        </>
      )}
    </>
  );
};

export default TimeCountDown;
