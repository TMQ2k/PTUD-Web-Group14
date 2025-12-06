import { twMerge } from "tailwind-merge";
import { useProduct } from "../../context/ProductDetailsContext";

const ImageOverLay = ({ className }) => {
  return (    
    <div
      className={twMerge(
        `absolute left-0 top-0 w-full h-full hover:bg-black/50
          text-transparent hover:text-2xl hover:text-white text-center z-20 rounded-lg
          flex justify-center items-center transition-all duration-500`,
        className
      )}
    >
      <button className="hover:underline cursor-pointer hover:text-white/80">
        Xem thêm...
      </button>
    </div>    
  );
};

const ProductGallery = () => {
  const product = useProduct();

  return (
    <main className="flex flex-col gap-4 w-full">
      <section className="w-full grid grid-cols-3 gap-2">
        <div className="col-span-2 relative border-4 border-blue-600 rounded-xl w-fit">
          <img
            src={product.image_cover_url}
            alt="Main product image"
            className="z-10 h-full rounded-lg"
          />
          <ImageOverLay />
        </div>
        <ul className="col-span-1 flex flex-col gap-2">
          {product.extra_image_urls.map((path, i) => (
            <li key={i + 1} className="relative w-fit">
              <img
                src={path}
                alt={`Extra product image ${i + 1}`}
                className="size-45 object-cover object-center rounded-lg"
              />
              <ImageOverLay className="hover:text-base" />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default ProductGallery;
