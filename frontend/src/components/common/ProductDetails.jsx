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
import { BlinkBlur } from "react-loading-indicators";
import ProductCard from "./ProductCard";

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

        const other_products_quantity = 5;
        const respone = await productApi.getProductById(
          params.id,
          other_products_quantity
        );
        console.log(respone.data);
        if (isMounted) {
          dispatch({
            type: "load",
            payload: respone.data,
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
  }, [params.id]);

  return (
    <>
      {isLoading && (
        <div className="h-screen w-full flex items-center justify-center">
          <BlinkBlur color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      )}
      {error && <div>{error}</div>}
      {!isLoading && !error && (
        <div className="flex flex-row gap-4 my-4 px-5 justify-between h-full w-full">
          <ProductContext.Provider value={product}>
            <ProductDispatchContext.Provider value={dispatch}>
              <ProductInfomation />
              <AuctionBidCard />
              {product?.otherProducts?.map((p, i) => (
                <ProductCard key={i} {...product} />
              ))}
            </ProductDispatchContext.Provider>
          </ProductContext.Provider>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
