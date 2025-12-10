import { http } from "../libs/http";
import { authStorage } from "../utils/auth";

const sellerEndpoints = {
  getSellerStartTime: "/seller/seller-start-time",  
  deactiveExpiredSeller: "/seller/deactivate-expired-sellers"  
}

export const sellerApi = {
  getSellerStartTime: async () => {
    const respone = await http.get(sellerEndpoints.getSellerStartTime, {
      headers: {
        Authorization: `Bearer ${authStorage.getToken()}`
      }
    });    

    return respone.data;
  },

  updateUserRole: async () => {
    const respone = await http.put(sellerEndpoints.deactiveExpiredSeller);

    return respone.data;
  }
}