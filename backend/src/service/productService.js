import dotenv from "dotenv";
dotenv.config();

import "../model/productModel.js";
import {
  getProductBaseInfoById as getProductBaseInfoByIdRepo,
  getProductImages as getProductImagesRepo,
  otherProductsByCategory as otherProductsByCategoryRepo,
  getSearchProducts as getSearchProductsRepo,
  postProduct as postProductRepo,
  getProductsList as getProductsListRepo,
  deactiveProduct as deactiveProductRepo,
  getCategoriesByProductId as getCategoriesByProductIdRepo,
  getProductBidHistory as getProductBidHistoryRepo,
  getProductListByQuery as getProductListByQueryRepo,
  updateDescription as updateDescriptionRepo,
  getRecentlyEndedProducts as getRecentlyEndedProductsRepo,
} from "../repo/productRepo.js";

import {
  getBidHistoryByProductId,
  getHighestBidInfoofUserOnProduct,
  getTopBidderIdByProductId,
  countHistoryByProductId,
} from "../repo/bidderRepo.js";

import { 
  getUserInfoById,
  getUserProfile
 } from "../repo/userRepo.js";
import {
  otherProductsInfo,
  Product,
  ProductProfile,
} from "../model/productModel.js";

import { sendNotificationEmail } from "./emailService.js";

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
        prod.starting_price,
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

export const getProductDetailsById = async (productId, user, limit = 5) => {
  const productInfo = await getProductBaseInfoByIdRepo(productId);
  if (!productInfo) {
    throw new Error("Product not found");
  }

  const productImages = await getProductImagesRepo(productId);
  const historyCount = await countHistoryByProductId(productId);
  const topBidderId = await getTopBidderIdByProductId(productId);
  const topBidderInfo = topBidderId ? await getUserInfoById(topBidderId) : null;
  const sellerInfo = await getUserInfoById(productInfo.seller_id);
  sellerInfo.id = productInfo.seller_id;
  const productCategories = await getCategoriesByProductIdRepo(productId);
  const otherProducts = await otherProductsByCategoryRepo(
    productCategories.map((cat) => cat.category_id),
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

  otherProducts.map(
    (prod) =>
      new otherProductsInfo(
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
    product_id: productInfo.product_id,
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
    history_count: historyCount,
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
  extra_image_urls,
  category_ids
) => {
  const newProduct = await postProductRepo(
    user.id,
    name,
    description,
    starting_price,
    step_price,
    buy_now_price,
    image_cover_url,
    end_time,
    extra_image_urls,
    category_ids
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
}

export const sendNoBidderNotificationEmail = async (sellerEmail, sellerName, productName) => {
  const subject = "Thông báo kết thúc đấu giá sản phẩm";
  const message = `Kính gửi ${sellerName},\n\nSản phẩm đấu giá "${productName}" của bạn đã kết thúc mà không có người đấu thầu nào.\n\nTrân trọng,\nĐội ngũ đấu giá`;
  try {
    await sendNotificationEmail(sellerEmail, subject, message);
  } catch (err) {
    console.error("❌ Lỗi khi gửi email thông báo không có người đấu thầu:", err);
    throw err;
  } 
};

export const sendWinningBidderNotificationEmail = async (bidderEmail, bidderName, productName, finalPrice) => {
  const subject = "Chúc mừng bạn đã thắng đấu giá!";
  const message = `Kính gửi ${bidderName},\n\nChúc mừng bạn đã thắng đấu giá sản phẩm "${productName}" với giá cuối cùng là ${finalPrice}.\n\nVui lòng liên hệ với người bán để hoàn tất giao dịch.\n\nTrân trọng,\nĐội ngũ đấu giá`;
  try {
    await sendNotificationEmail(bidderEmail, subject, message);
  } catch (err) {
    console.error("❌ Lỗi khi gửi email thông báo người đấu thầu thắng:", err);
    throw err;
  }
};

export const sendSellerNotificationEmail = async (sellerEmail, sellerName, productName, finalPrice, bidderName) => {
  const subject = "Thông báo sản phẩm đấu giá đã kết thúc";
  const message = `Kính gửi ${sellerName},\n\nSản phẩm đấu giá "${productName}" của bạn đã kết thúc với người thắng cuộc là ${bidderName} với giá cuối cùng là ${finalPrice}.\n\nVui lòng liên hệ với người thắng cuộc để hoàn tất giao dịch.\n\nTrân trọng,\nĐội ngũ đấu giá`;
  try {
    await sendNotificationEmail(sellerEmail, subject, message);
  }
  catch (err) {
    console.error("❌ Lỗi khi gửi email thông báo người bán:", err);
    throw err;
  }
};

export const getProductListByQuery = async(query, limit, page, sortBy, is_active) => {
  const products = await getProductListByQueryRepo(query, limit, page, sortBy, is_active);
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
  return products.map(
    (prod) =>
      new ProductProfile(
        prod.product_id,
        prod.name,
        prod.image_cover_url,
        prod.starting_price,
        prod.current_price,
        prod.buy_now_price,
        prod.is_active,
        prod.created_at,
        prod.end_time,
        prod.top_bidder,
        prod.history_count
      )
  );
}

export const updateDescription = async (productId, newDescription) => {
  const updatedProductDescription = await updateDescriptionRepo(productId, newDescription);
  if (!updatedProductDescription) {
    throw new Error("Failed to update product description");
  }
  return updatedProductDescription;
}