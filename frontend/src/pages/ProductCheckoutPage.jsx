import { useState } from "react";
import ProductCheckout from "../components/common/ProductCheckout";
import SellerProductCheckout from "../components/common/SellerProductCheckout";

const ProductCheckoutPage = () => {
  const [showSellerCheckout, setShowSellerCheckout] = useState(false);

  return (
    <>
      <div className="w-full flex flex-row justify-end items-center h-fit">
        <button
          onClick={() => setShowSellerCheckout(!showSellerCheckout)}
          className={`bg-linear-to-br ${
            showSellerCheckout
              ? "from-amber-400 to-red-600"
              : "from-blue-400 to-purple-600"
          } hover:scale-102 active:scale-98
                     hover:shadow-lg transition-all duration-300 rounded-lg text-white px-2 py-2 
                     font-bold mt-2 mr-2`}
        >
          {showSellerCheckout ? "Product" : "Seller"} Checkout
        </button>
      </div>
      {showSellerCheckout ? <SellerProductCheckout /> : <ProductCheckout />}
    </>
  );
};

export default ProductCheckoutPage;
