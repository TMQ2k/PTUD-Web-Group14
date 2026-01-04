import { twMerge } from "tailwind-merge";
import { useState } from "react";

const Image = ({ src, alt, className="", size="28" }) => {
  const [isZoomed, setZoomed] = useState(false);

  return (
    <>
      <div className={twMerge("flex flex-col items-center", className)}>
        <div
          onClick={() => setZoomed(true)}
          className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group relative cursor-pointer"
        >
          <img
            src={src}
            alt={alt}
            className={`size-${size} object-contain rounded-lg group-hover:opacity-90 transition-opacity`}
          />              
          <div className="absolute inset-0 bg-blue-900/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-bold text-center">
              Click to
              <br />
              Enlarge
            </span>
          </div>
        </div>        
      </div>
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity animate-in fade-in duration-200"
          onClick={() => setZoomed(false)} // Clicking anywhere closes it
        >
          <div
            className="relative bg-white p-4 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >            
            {/* The Large QR Code */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 mx-auto">
              <img
                src={src}
                alt="Full Size IMAGE"
                className="w-full h-auto object-contain"
              />
            </div>

            <button
              onClick={() => setZoomed(false)}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Image;