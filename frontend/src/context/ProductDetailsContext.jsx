import { createContext, useContext, } from "react";
import default_avatar from "../../public/images/default/default_avatar.jfif"
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
          points: action.payload.rating,
          username: action.payload.username,
          avatar_url: action.payload.avatar_url || default_avatar,
        }
      }
    }
  }
}

