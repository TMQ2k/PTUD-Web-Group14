import dotenv from "dotenv";
dotenv.config();

import "../model/productModel.js";
import {
  getHighestPricedProducts as getHighestPricedProductsRepo,
  getTopCurrentProducts as getTopCurrentProductsRepo,
  getMostBiddedProducts as getMostBiddedProductsRepo,
  getProductsByCategory as getProductsByCategoryRepo,
  getProductBaseInfoById as getProductBaseInfoByIdRepo,
  getProductImages as getProductImagesRepo,
  getProductBidHistory as getProductBidHistoryRepo,
  deleteProductById as deleteProductByIdRepo,
} from "../repo/productRepo.js";

import {
  getBidHistoryByProductId,
  getHighestBidInfoofUserOnProduct,
  getTopBidderIdByProductId,
} from "../repo/bidderRepo.js";

import { getUserInfoById } from "../repo/userRepo.js";

export const getHighestPricedProducts = async (limit = 5) => {
  const products = await getHighestPricedProductsRepo(limit);
  if (!products) {
    throw new Error("No products found");
  }
  return products;
};

export const getTopCurrentProducts = async (limit = 5) => {
  const products = await getTopCurrentProductsRepo(limit);
  if (!products) {
    throw new Error("No products found");
  }
  return products;
};

export const getMostBiddedProducts = async (limit = 5) => {
  const products = await getMostBiddedProductsRepo(limit);
  if (!products) {
    throw new Error("No products found");
  }
  return products;
};

export const getProductsByCategory = async (categoryId) => {
  const products = await getProductsByCategoryRepo(categoryId);
  if (!products) {
    throw new Error("No products found for this category");
  }
  return products;
};

export const getProductDetailsById = async (productId, user) => {
  const productInfo = await getProductBaseInfoByIdRepo(productId);
  if (!productInfo) {
    throw new Error("Product not found");
  }

  const productImages = await getProductImagesRepo(productId);
  const bidHistory = await getBidHistoryByProductId(productId);
  const topBidderId = await getTopBidderIdByProductId(productId);
  const topBidderInfo = topBidderId ? await getUserInfoById(topBidderId) : null;
  const sellerInfo = await getUserInfoById(productInfo.seller_id);
  let userHighestBidInfo = null;
  if (user && user.role == "bidder") {
    userHighestBidInfo = await getHighestBidInfoofUserOnProduct(
      productId,
      user.user_id
    );
  }

  return {
    productId: productInfo.product_id,
    seller: sellerInfo,
    name: productInfo.name,
    description: productInfo.description,
    starting_price: productInfo.starting_price,
    buy_now_price: productInfo.buy_now_price,
    step_price: productInfo.step_price,
    current_price: productInfo.current_price,
    image_cover_url: productInfo.image_cover_url,
    extra_image_url: productImages,
    is_active: productInfo.is_active,
    created_at: productInfo.created_at,
    end_time: productInfo.end_time,
    bidder: userHighestBidInfo,
    top_bidder: topBidderInfo,
    history: bidHistory,
  };
};

export const getProductBidHistoryService = async (productId) => {
  try {
    const bidHistory = await getProductBidHistoryRepo(productId);
    return bidHistory;
  } catch (err) {
    console.error("❌ [Service] Lỗi khi lấy lịch sử đấu giá sản phẩm:", err);
    throw err;
  }
};

export const deleteProductById = async (productId) => {
  const result = await deleteProductByIdRepo(productId);
  if (!result) {
    throw new Error("Failed to delete product");
  }
  return result;
};
