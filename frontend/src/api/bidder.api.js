import { http } from "../libs/http";
import { authStorage } from "../utils/auth";

const bidderEndpoint = {
  autobid: "/bidder/auto-bid",
  autobidUpdate: "/bidder/auto-bid/update",
  requestProduct: "/bidder/request-bidder-on-product",
};

export const bidderApi = {
  autobid: async (productId, maxBidAmount) => {    
    const autobidData = {
      productId: productId,
      maxBidAmount: maxBidAmount,
    };    

    const respone = await http.put(bidderEndpoint.autobid, autobidData, {
      headers: {
        Authorization: `Bearer ${authStorage.getToken()}`,
      },
    });

    return respone.data;
  },
  autobidUpdate: async (productId) => {    
    const respone = await http.put(`${bidderEndpoint.autobidUpdate}/${productId}`, {}, {});
    return respone.data;
  },
  requestProduct: async (productId, reason) => {
    const requestData = {
      productId: productId,
      reason: reason,
    }

    const respone = await http.post(bidderEndpoint.requestProduct,requestData, {});
    return respone.data;
  }
};