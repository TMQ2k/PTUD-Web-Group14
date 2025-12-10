import { useEffect, useState } from "react";
import { useProduct } from "../../context/ProductDetailsContext";
import { getProgress } from "../../utils/DateTimeCalculation";

const ProgressBar = ({ className = "" }) => {
  const product = useProduct();
  const [proportion, setProportion] = useState(0);

  useEffect(() => {
    const progressConfiguration = () => {
      const progress =
      getProgress(product.created_at, product.end_time).toFixed(2) * 100;      
      setProportion(progress);
    };
    const interval_id = setInterval(() => {
      progressConfiguration();
    }, 1000);

    return () => {
      clearInterval(interval_id);
    };
  }, [product.created_at, product.end_time]);

  return (
    <>
      <div className={`h-1 w-full bg-gray-300 rounded-2xl ` + className}>
        <div
          style={{ width: `${proportion}%` }}
          className={`h-full rounded-2xl max-w-full bg-linear-to-r from-blue-400 to-purple-600 `}
        ></div>
      </div>
    </>
  );
};

export default ProgressBar;
