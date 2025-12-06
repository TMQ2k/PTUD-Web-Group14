import { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import ProductGalleryCard from "./ProductGalleryCard";
import AuctionBidCard from "./AuctionBidCard";
import {
  ProductContext,
  ProductDispatchContext,
  productReducer,
} from "../../context/ProductDetailsContext";
import { productApi } from "../../api/product.api";
import ProductInfomation from "./ProductInfomation";

const ProductDetails = () => {    
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [product, dispatch] = useReducer(productReducer, {});

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        //const url = `/products/${params.id}`;
        const product = await productApi.getProductById(params.id);   
        console.log(product)             ;
        //const { data: products } = res;
        if (isMounted) {          
          dispatch({
            type: "load",
            payload: product,
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
