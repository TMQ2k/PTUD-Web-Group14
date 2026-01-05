//import { useParams } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { useProduct } from "../../context/ProductDetailsContext";
import { isEndingSoon } from "../../utils/DateTimeCalculation";
import ProductGallery from "./ProductGallery";
import { useEffect, useState } from "react";

const ProductGalleryCard = () => {
  const product = useProduct();
  const [endingSoon, setEngdingSoon] = useState(false);

  const { created_at, end_time } = product;

  useEffect(() => {
    const interval_id = setInterval(() => {
      if (isEndingSoon(new Date(created_at), new Date(end_time))) {
        setEngdingSoon(true);
      }
    }, 1000);

    return () => {
      clearInterval(interval_id);
    };
  }, [created_at, end_time]);

  return (
    <article className="w-full h-full">
      <header className="mb-5">
        {endingSoon && (
          <h3 className="text-red-600 flex flex-row gap-1 font-semibold text-lg underline">
            <FaRegClock className="w-5 h-7" />
            <p>Sắp kết thúc</p>
          </h3>
        )}
        <h1 className="text-4xl font-bold">{product.name}</h1>
      </header>
      <article className="w-full">
        <ProductGallery />
      </article>
    </article>
  );
};

export default ProductGalleryCard;
