import { twMerge } from "tailwind-merge";
import { useProduct } from "../../context/ProductDetailsContext";
import default_image from "../../../public/images/default/unavailable_item.jpeg";

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
  // Helper to ensure we always have an array of 3 items (filled with placeholders if needed)
  // This logic is moved here to keep the JSX clean
  const displayImages =
    product.extra_image_url.length > 0
      ? product.extra_image_url.slice(0, 3) // Limit to 3 to match layout
      : Array(3).fill(default_image);

  const main_image = product.image_cover_url.toLowerCase().includes("example")
    ? default_image
    : product.image_cover_url;

  return (
    <main className="flex flex-col gap-4 w-full">
      {/* 1. aspect-[4/3]: Sets a standard shape for the gallery (prevents layout shift).
         2. h-full: Ensures the grid cells stretch to match each other.
      */}
      <section className="w-full grid grid-cols-3 gap-2 aspect-4/3">
        {/* === MAIN IMAGE === */}
        <div className="col-span-2 relative border-4 border-blue-600 rounded-xl overflow-hidden">
          <img
            src={main_image}
            alt="Main product image"
            // object-cover ensures the image fills the box without stretching/distorting
            className="w-full h-full object-cover"
          />
          <ImageOverLay />
        </div>

        {/* === SIDEBAR LIST === */}
        {/* h-full ensures this list is exactly as tall as the Main Image div */}
        <ul className="col-span-1 flex flex-col gap-2 h-full">
          {displayImages.map((path, i) => (
            // flex-1: Magically calculates (100% height - gaps) / 3
            <li
              key={i}
              className="relative w-full flex-1 rounded-lg overflow-hidden"
            >
              <img
                src={path}
                alt={`Extra ${i}`}
                // absolute + inset-0: Forces image to conform to the li's calculated height
                className="absolute inset-0 w-full h-full object-cover object-center"
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
