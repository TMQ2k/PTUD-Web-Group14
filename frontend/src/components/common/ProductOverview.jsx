import { twMerge } from "tailwind-merge";
import { useProduct } from "../../context/ProductDetailsContext";
import ProductBaseInformation from "./ProductBaseInformation";

const OverviewSection = ({ title, children, className = "" }) => {
  return (
    <section className={twMerge("w-full", className)}>
      <h3 className="text-2xl text-blue-600 font-semibold">{title}</h3>
      {children}
    </section>
  );
};

const ProductOverview = () => {
  const product = useProduct();

  return (
    <article className="flex flex-col gap-5 bg-slate-100  
                        hover:shadow-black/20 transition-all duration-300 rounded-md py-5 pl-5 pr-2 
                        text-balance">
      <OverviewSection title="Mô tả từ người bán">
        <p className="text-pretty font-semibold">{product.description}</p>
      </OverviewSection>
      <OverviewSection title="Thông tin chung">
        <ProductBaseInformation />
      </OverviewSection>
    </article>
  );
};

export default ProductOverview;
