import { useState, Activity } from "react";
import { ShoppingBag, Store } from "lucide-react"; // npm install lucide-react
import ProductCheckout from "../components/common/ProductCheckout";
import SellerProductCheckout from "../components/common/SellerProductCheckout";

const ProductCheckoutPage = () => {
  const [showSellerCheckout, setShowSellerCheckout] = useState(false);

  return (
    <>
      <div className="w-full flex justify-end items-center mb-6 pr-4 pt-4">
        {/* Container */}
        <div className="bg-gray-100 p-1.5 rounded-xl inline-flex shadow-inner">
          {/* Buyer Button */}
          <button
            onClick={() => setShowSellerCheckout(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-out
              ${
                !showSellerCheckout
                  ? "bg-white text-blue-600 shadow-sm shadow-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <ShoppingBag size={18} />
            Product Checkout
          </button>

          {/* Seller Button */}
          <button
            onClick={() => setShowSellerCheckout(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-out
              ${
                showSellerCheckout
                  ? "bg-white text-rose-600 shadow-sm shadow-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Store size={18} />
            Seller Checkout
          </button>
        </div>
      </div>

      {/* Note: Using standard conditional rendering here. 
         If you need to keep component state alive (hidden but mounted),
         use CSS display styles instead.
      */}
      {/* <div className={showSellerCheckout ? "hidden" : "block"}>
        <ProductCheckout />
      </div>
      
      <div className={showSellerCheckout ? "block" : "hidden"}>
        <SellerProductCheckout />
      </div> */}

      <Activity mode={showSellerCheckout ? "hidden" : "visible"}>
<<<<<<< HEAD
        <ProductCheckout out />
=======
        <ProductCheckout />
>>>>>>> 8b920f36a272c8daf223178066a79aa7f26891c2
      </Activity>
      <Activity mode={showSellerCheckout ? "visible" : "hidden"}>
        <SellerProductCheckout />
      </Activity>
    </>
  );
};

export default ProductCheckoutPage;
