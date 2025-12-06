import { useState, useEffect, useReducer } from "react";
import ProductGalleryCard from "./ProductGalleryCard";
import AuctionBidCard from "./AuctionBidCard";
import {
  ProductContext,
  ProductDispatchContext,
  productReducer,
} from "../../context/ProductDetailsContext";
import { http } from "../../utils/http";
import ProductInfomation from "./ProductInfomation";

const ProductDetails = () => {    
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [product, dispatch] = useReducer(productReducer, {});

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = "/products";
        const res = await http.get(url);                
        const { data: products } = res;
        if (isMounted) {          
          dispatch({
            type: "load",
            payload: products[0],
          });
        }
      } catch (error) {
        if (isMounted) setError(error.message);
        console.error("Error loading product ", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();    

    return () => {
      isMounted = false;
    };
  }, []);  
  
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!isLoading && !error && (
        <div className="flex flex-row gap-4 my-4 px-5 justify-between h-full w-full">
          <ProductContext.Provider value={product}>
            <ProductDispatchContext.Provider value={dispatch}>
              <ProductInfomation />
              <AuctionBidCard />
            </ProductDispatchContext.Provider>
          </ProductContext.Provider>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
