import { http } from "../libs/http";
import { authStorage } from "../utils/auth";

const commentEndpoint = {
  common: "/comments"
}

export const commentApi = {
  getAllComments: async (productId) => {
    const respone = await http.get(`${commentEndpoint.common}/${productId}`);
    return respone.data;
  },

  postComment: async (productId, payload) => {
    const respone = await http.post(`${commentEndpoint.common}/${productId}`, payload, {
      headers: {
        Authorization: `Bearer ${authStorage.getToken()}`,
      }
    });
    return respone.data;
  }
}