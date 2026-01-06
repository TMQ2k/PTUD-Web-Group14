import ProductGalleryCard from "./ProductGalleryCard";
import ProductOverview from "./ProductOverview";

const ProductInfomation = () => {
  return (
    <div className="flex flex-col w-full gap-5">
      <ProductGalleryCard />
      <ProductOverview />
    </div>
  );
}

export default ProductInfomation;