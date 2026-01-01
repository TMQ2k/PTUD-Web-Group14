import { createContext, useContext, } from "react";

export const ProductContext = createContext(null);
export const ProductDispatchContext = createContext(null);

export const useProduct = () => {
  return useContext(ProductContext);
}

export const useProductDispatch = () => {
  return useContext(ProductDispatchContext);
}

export const productReducer = (product, action) => {
  switch (action.type) {
    case "load": {
      return action.payload;
    }
    case "change-max-price": {
      return {
        ...product, 
        bidder: {
          ...product.user,
          highest_price: action.price  
        }
      }
    }
    case "autobid-update": {
      return {
        ...product,
        current_price: action.payload.current_price,
        top_bidder: {
          ...product.top_bidder,
          points: action.payload.points,
          name: action.payload.username,
          avatar_url: action.payload.avatar_url || product.top_bidder?.avatar_url,
        }
      }
    }
  }
}

