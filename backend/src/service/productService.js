import dotenv from "dotenv";
dotenv.config();

import "../model/productModel.js";
import {
  getProductBaseInfoById as getProductBaseInfoByIdRepo,
  getProductImages as getProductImagesRepo,
  getProductBidHistory as getProductBidHistoryRepo,
  deleteProductById as deleteProductByIdRepo,
  otherProductsByCategory as otherProductsByCategoryRepo,
  getSearchProducts as getSearchProductsRepo,
  getProductsList as getProductsListRepo,
  postProduct as postProductRepo,
  deactiveProduct as deactiveProductRepo,
} from "../repo/productRepo.js";

import {
  getBidHistoryByProductId,
  getHighestBidInfoofUserOnProduct,
  getTopBidderIdByProductId,
  countHistoryByProductId,
} from "../repo/bidderRepo.js";

import { getUserInfoById } from "../repo/userRepo.js";
import { Product, ProductProfile } from "../model/productModel.js";

export const getSearchProducts = async (
  search,
  categoryName,
  limit = 10,
  page = 1
) => {
  const offset = (page - 1) * limit;
  const products = await getSearchProductsRepo(
    search,
    categoryName,
    limit,
    offset
  );
  for (let prod of products) {
    const top_bidder_id = await getTopBidderIdByProductId(prod.product_id);
    if (top_bidder_id) {
      prod.top_bidder = await getUserInfoById(top_bidder_id);
    } else {
      prod.top_bidder = null;
    }
    const countHistory = await countHistoryByProductId(prod.product_id);
    prod.history_count = countHistory;
  }
  if (!products) {
    throw new Error("No products found");
  }
  return products;
};

export const getProductsList = async (
  categoryId,
  limit,
  page = 1,
  sortBy,
  is_active
) => {
  const products = await getProductsListRepo(
    categoryId,
    limit,
    page,
    sortBy,
    is_active
  );
  for (let prod of products) {
    const top_bidder_id = await getTopBidderIdByProductId(prod.product_id);
    if (top_bidder_id) {
      prod.top_bidder = await getUserInfoById(top_bidder_id);
    } else {
      prod.top_bidder = null;
    }
    const countHistory = await countHistoryByProductId(prod.product_id);
    prod.history_count = countHistory;
  }
  if (!products) {
    throw new Error("No products found");
  }

  //Filt products attributes to match ProductProfile
  return products.map(
    (prod) =>
      new ProductProfile(
        prod.product_id,
        prod.name,
        prod.image_cover_url,
        prod.current_price,
        prod.buy_now_price,
        prod.is_active,
        prod.created_at,
        prod.end_time,
        prod.top_bidder,
        prod.history_count
      )
  );
};

export const getProductDetailsById = async (productId, limit, user) => {
  const productInfo = await getProductBaseInfoByIdRepo(productId);
  if (!productInfo) {
    throw new Error("Product not found");
  }

  const productImages = await getProductImagesRepo(productId);
  const bidHistory = await getBidHistoryByProductId(productId);
  const topBidderId = await getTopBidderIdByProductId(productId);
  const topBidderInfo = topBidderId ? await getUserInfoById(topBidderId) : null;
  const sellerInfo = await getUserInfoById(productInfo.seller_id);
  const otherProducts = await otherProductsByCategoryRepo(
    productInfo.category_id,
    productId,
    limit
  );

  for (let prod of otherProducts) {
    const countHistory = await countHistoryByProductId(prod.product_id);
    prod.history_count = countHistory;
    const top_bidder_id = await getTopBidderIdByProductId(prod.product_id);
    if (top_bidder_id) {
      const top_bidder_info = await getUserInfoById(top_bidder_id);
      prod.top_bidder = {
        name: top_bidder_info.username,
      };
    } else {
      prod.top_bidder = null;
    }
  }

  otherProducts.map((prod) =>
    otherProductsInfo(
      prod.product_id,
      prod.name,
      prod.image_cover_url,
      prod.step_price,
      prod.current_price,
      prod.buy_now_price,
      prod.is_active,
      prod.created_at,
      prod.end_time,
      prod.top_bidder,
      prod.history_count
    )
  );

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
    otherProducts: otherProducts,
  };
};

export const postProduct = async (
  user,
  name,
  description,
  starting_price,
  step_price,
  buy_now_price,
  image_cover_url,
  end_time,
  extra_image_urls
) => {
  if (user.role !== "seller") {
    throw new Error("Only sellers can create products");
  }
  const newProduct = await postProductRepo(
    user.user_id,
    name,
    description,
    starting_price,
    step_price,
    buy_now_price,
    image_cover_url,
    end_time,
    extra_image_urls
  );
  return newProduct;
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

export const deactiveProduct = async () => {
  const result = await deactiveProductRepo();
  return result;
};
