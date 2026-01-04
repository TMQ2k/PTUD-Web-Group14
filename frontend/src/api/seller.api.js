import { http } from "../libs/http";
import { authStorage } from "../utils/auth";

const sellerEndpoints = {
  getSellerStartTime: "/seller/seller-start-time",
  deactiveExpiredSeller: "/seller/deactivate-expired-sellers",
  bidsPendingList: "/seller/all-requests",
  rejectBidder: "/seller/seller-reject-bidder",
  deleteBannedBidder: "/seller/seller-delete-banned-bidder",
  allowBidder: "/seller/seller-allow-bidder",  
  enableAuctionExtension: "/seller/enable-auction-extension",
};

export const sellerApi = {
  getSellerStartTime: async () => {
    const respone = await http.get(sellerEndpoints.getSellerStartTime, {
      headers: {
        Authorization: `Bearer ${authStorage.getToken()}`,
      },
    });

    return respone.data;
  },

  updateUserRole: async () => {
    const respone = await http.put(sellerEndpoints.deactiveExpiredSeller);

    return respone.data;
  },

  getBiddersPendingList: async (product_id) => {
    const respone = await http.get(
      `${sellerEndpoints.bidsPendingList}/${product_id}`,
      {
        headers: {
          Authorization: `Bearer ${authStorage.getToken()}`,
        },
      }
    );
    return respone.data;
  },

  rejectBidder: async (product_id, bidder_id) => {
    const respone = await http.post(
      sellerEndpoints.rejectBidder,
      {
        productId: product_id,
        bidderId: bidder_id,
        reason: null,
      },
      {
        headers: {
          Authorization: `Bearer ${authStorage.getToken()}`,
        },
      }
    );

    return respone.data;
  },

  deleteBannedBidder: async (product_id, bidder_id) => {
    console.log(product_id);
    const respone = await http.delete(
      sellerEndpoints.deleteBannedBidder,
      {
        // 1. Put the body inside the "data" key
        data: {
          productId: product_id,
          bidderId: bidder_id,
        },
        // 2. Headers go in the same config object
        headers: {
          Authorization: `Bearer ${authStorage.getToken()}`,
        },
      }
    );

    return respone.data;
  },

  acceptBidder: async (product_id, bidder_id) => {
    const respone = await http.post(
      `${sellerEndpoints.allowBidder}`,
      {
        productId: product_id,
        bidderId: bidder_id,        
      },
      {
        headers: {
          Authorization: `Bearer ${authStorage.getToken()}`,
        },
      }
    );

    return respone.data;
  },

  enableAuctionExtension: async (productId) => {
    const respone = await http.post(sellerEndpoints.enableAuctionExtension, {
      productId: productId,
    }, {});

    return respone.data;
  }
};
