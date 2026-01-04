import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useProduct } from "../../context/ProductDetailsContext";
import default_image from "../../../public/images/default/unavailable_item.jpeg";

// Simple Icon Components (Internal)
const ChevronLeft = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
);
const ChevronRight = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
);

const ProductGallery = () => {
  const product = useProduct();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Data Preparation
  const mainImageRaw = product.image_cover_url;
  const mainImage =
    !mainImageRaw || mainImageRaw.toLowerCase().includes("example")
      ? default_image
      : mainImageRaw;
  
  const extraImages = product.extra_image_url || [];
  const slides = [mainImage, ...extraImages];
  
  // Ensure we have at least one slide to prevent crashes
  if (slides.length === 0) slides.push(default_image);

  // 2. Navigation Logic
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="w-full flex flex-col gap-4">
      {/* === MAIN SLIDER === */}
      <div className="relative w-full aspect-4/3 max-h-[600px] group m-auto rounded-xl overflow-hidden shadow-lg bg-gray-100">
        
        {/* A. The Sliding Track */}
        <div
          className="w-full h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((url, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={url}
                alt={`Product slide ${index}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* B. The Border Overlay 
            Fixes the "missing border" bug by sitting ON TOP of the image 
            pointer-events-none ensures clicks pass through to the image/arrows 
        */}
        <div className="absolute inset-0 border-4 border-blue-600 rounded-xl pointer-events-none" />

        {/* C. Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-4 p-2 rounded-full 
                     bg-black/20 text-white hover:bg-black/50 cursor-pointer 
                     transition-all duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={30} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-full 
                     bg-black/20 text-white hover:bg-black/50 cursor-pointer 
                     transition-all duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={30} />
        </button>

        {/* D. Dot Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
          {slides.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => setCurrentIndex(slideIndex)}
              className={twMerge(
                "w-3 h-3 rounded-full cursor-pointer transition-all duration-300 shadow-sm border border-black/10",
                currentIndex === slideIndex
                  ? "bg-white w-6" 
                  : "bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      </div>
      
      {/* === THUMBNAILS === */}
      <div className="flex gap-2 overflow-x-auto mx-auto py-4 px-1">
        {slides.map((url, idx) => (
            <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={twMerge(
                    // Added p-1 to create the "white frame" gap seen in your screenshot
                    // Added border-gray-200 so inactive items are visible against white backgrounds
                    "shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-300 p-0.5",
                    currentIndex === idx 
                        ? "border-blue-600 opacity-100 scale-105 ring-1 ring-blue-600" 
                        : "border-gray-200 opacity-70 hover:opacity-100 hover:border-blue-300"
                )}
            >
                {/* Image Wrapper to respect the rounded corners inside the border */}
                <div className="w-full h-full rounded overflow-hidden relative">
                    <img src={url} alt="thumb" className="w-full h-full object-cover" />
                </div>
            </button>
        ))}
      </div>
    </main>
  );
};

export default ProductGallery;