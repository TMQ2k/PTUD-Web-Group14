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
  getProductBySellerIdRepo,
  enableExtentionForProductRepo,
  bannedListProductRepo,
  updateDescription as updateDescriptionRepo,
  getRecentlyEndedProducts as getRecentlyEndedProductsRepo,
  getWinningBidderByProductId as getWinningBidderByProductIdRepo,
  getProductProfile,  
  deactiveProductById as deactiveProductByIdRepo,
  updateCurrentPrice,
  countProductsByQuery,
  countProductsList,
  getProdudctsListByBidderId as getProdudctsListByBidderIdRepo,
  countProductsByBidderId,
} from "../repo/productRepo.js";

import {
  getBidHistoryByProductId,
  getHighestBidInfoofUserOnProduct,
  getTopBidderIdByProductId,
  countHistoryByProductId,
  upsertAutoBid,
  isBidsOnProductRepo,
} from "../repo/bidderRepo.js";

import {
  getUserInfoById,
  getUserProfile,
  addUserWonProductRepo,
} from "../repo/userRepo.js";
import {
  otherProductsInfo,
  Product,
  ProductProfile,
} from "../model/productModel.js";

import { sendNotificationEmail } from "./emailService.js";
import { composer } from "googleapis/build/src/apis/composer/index.js";

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

export const getMetaDataForProductsList = async (
  categoryId,
  limit,
  page,
  is_active
) => {
  const totalProducts = await countProductsList(categoryId, is_active);
  let limitPerPage = limit;
  if (!limitPerPage || limitPerPage <= 0) {
    limitPerPage = totalProducts; // Default limit
  }
  const totalPages = Math.ceil(totalProducts / limitPerPage);
  let previousPage, nextPage;
  if (page > 1 && page <= totalPages) {
    previousPage = true;
  } else {
    previousPage = false;
  }
  if (page < totalPages) {
    nextPage = true;
  } else {
    nextPage = false;
  }
  const currentPage = page;
  if (page > totalPages && totalProducts > 0) {
    throw new Error("Page number exceeds total pages available");
  }
  return {
    total_products: totalProducts,
    total_pages: totalPages,
    previous_page: previousPage,
    next_page: nextPage,
    current_page: currentPage,
    limit: limitPerPage,
  };
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
  if (result) {
    for (let prod of result) {
      const productProfile = await getProductProfile(prod);
      const sellerProfile = await getUserProfile(productProfile.seller_id);
      const historyCount = await countHistoryByProductId(
        productProfile.product_id
      );
      if (historyCount === 0) {
        await sendNoBidderNotificationEmail(
          sellerProfile.email,
          sellerProfile.username,
          productProfile.name
        );
      } else {
        const topBidderId = await getTopBidderIdByProductId(prod);
        const topBidderProfile = await getUserProfile(topBidderId);
        const finalPrice = productProfile.current_price;
        await sendWinningBidderNotificationEmail(
          topBidderProfile.email,
          topBidderProfile.username,
          productProfile.name,
          finalPrice
        );
        await sendSellerNotificationEmail(
          sellerProfile.email,
          sellerProfile.username,
          productProfile.name,
          finalPrice,
          topBidderProfile.username
        );
      }
    }
  }
  return [{}];
};

export const sendNoBidderNotificationEmail = async (
  sellerEmail,
  sellerName,
  productName
) => {
  const subject = "Thông báo kết thúc đấu giá sản phẩm";
  const message = `Kính gửi ${sellerName},\n\nSản phẩm đấu giá "${productName}" của bạn đã kết thúc mà không có người đấu thầu nào.\n\nTrân trọng,\nĐội ngũ đấu giá`;
  try {
    await sendNotificationEmail(sellerEmail, subject, message);
  } catch (err) {
    console.error(
      "❌ Lỗi khi gửi email thông báo không có người đấu thầu:",
      err
    );
    throw err;
  }
};

export const sendWinningBidderNotificationEmail = async (
  bidderEmail,
  bidderName,
  productName,
  finalPrice
) => {
  const subject = "Chúc mừng bạn đã thắng đấu giá!";
  const message = `Kính gửi ${bidderName},\n\nChúc mừng bạn đã thắng đấu giá sản phẩm "${productName}" với giá cuối cùng là ${finalPrice}.\n\nVui lòng liên hệ với người bán để hoàn tất giao dịch.\n\nTrân trọng,\nĐội ngũ đấu giá`;
  try {
    await sendNotificationEmail(bidderEmail, subject, message);
  } catch (err) {
    console.error("❌ Lỗi khi gửi email thông báo người đấu thầu thắng:", err);
    throw err;
  }
};

export const sendSellerNotificationEmail = async (
  sellerEmail,
  sellerName,
  productName,
  finalPrice,
  bidderName
) => {
  const subject = "Thông báo sản phẩm đấu giá đã kết thúc";
  const message = `Kính gửi ${sellerName},\n\nSản phẩm đấu giá "${productName}" của bạn đã kết thúc với người thắng cuộc là ${bidderName} với giá cuối cùng là ${finalPrice}.\n\nVui lòng liên hệ với người thắng cuộc để hoàn tất giao dịch.\n\nTrân trọng,\nĐội ngũ đấu giá`;
  try {
    await sendNotificationEmail(sellerEmail, subject, message);
  } catch (err) {
    console.error("❌ Lỗi khi gửi email thông báo người bán:", err);
    throw err;
  }
};

export const getProductListByQuery = async (
  query,
  limit,
  page,
  sortBy,
  is_active
) => {
  const products = await getProductListByQueryRepo(
    query,
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

export const getMetaDataByQuery = async (query, limit, page, is_active) => {
  const totalProducts = await countProductsByQuery(query, is_active);
  const totalPages = Math.ceil(totalProducts / limit);
  let previousPage, nextPage;
  if (page > 1 && page <= totalPages) {
    previousPage = true;
  } else {
    previousPage = false;
  }
  if (page < totalPages) {
    nextPage = true;
  } else {
    nextPage = false;
  }
  const currentPage = page;
  if (page > totalPages && totalProducts > 0) {
    throw new Error("Page number exceeds total pages available");
  }

  return {
    total_products: totalProducts,
    total_pages: totalPages,
    previous_page: previousPage,
    next_page: nextPage,
    current_page: currentPage,
    limit: limit,
  };
};

export const updateDescription = async (productId, newDescription) => {
  const updatedProductDescription = await updateDescriptionRepo(
    productId,
    newDescription
  );
  if (!updatedProductDescription) {
    throw new Error("Failed to update product description");
  }
  return updatedProductDescription;
};
export const getProductBySellerIdService = async (sellerId) => {
  const result = await getProductBySellerIdRepo(sellerId);
  return result;
};

export const enableExtentionForProductService = async (sellerId, productId) => {
  const result = await enableExtentionForProductRepo(sellerId, productId);
  return result;
};

export const bannedListProductService = async (productId) => {
  const result = await bannedListProductRepo(productId);
  return result;
};
export const getWinningBidderByProductId = async (user, productId) => {
  const productProfile = await getProductProfile(productId);
  const sellerId = productProfile.seller_id;
  if (user.id != sellerId) {
    throw new Error("Unauthorized access to winning bidder information");
  }
  try {
    const winningBidderId = await getWinningBidderByProductIdRepo(productId);
    const winningBidderProfile = winningBidderId
      ? await getUserProfile(winningBidderId)
      : null;
    return {
      bidder_id: winningBidderId ? winningBidderId : null,
      username: winningBidderProfile ? winningBidderProfile.username : null,
      email: winningBidderProfile ? winningBidderProfile.email : null,
      address: winningBidderProfile ? winningBidderProfile.address : null,
      phone: winningBidderProfile ? winningBidderProfile.phone_number : null,
    };
  } catch (err) {
    console.error("❌ [Service] Lỗi khi lấy người đấu thầu thắng cuộc:", err);
    throw err;
  }
};

export const deactiveProductById = async (user, productId) => {
  const result = await deactiveProductByIdRepo(productId);
  if (!result) {
    throw new Error("Failed to deactivate product");
  }
  const winning_bid = result.buy_now_price
    ? result.buy_now_price
    : result.current_price;
  await upsertAutoBid(result.seller_id, productId, winning_bid);
  await updateCurrentPrice(productId, winning_bid);
  await addUserWonProductRepo(productId, user.id, winning_bid);
  const userProfile = await getUserProfile(user.id);
  await sendWinningBidderNotificationEmail(
    userProfile.email,
    userProfile.username,
    result.name,
    winning_bid
  );

  const sellerProfile = await getUserProfile(result.seller_id);
  await sendSellerNotificationEmail(
    sellerProfile.email,
    sellerProfile.username,
    result.name,
    winning_bid,
    userProfile.username
  );

  return result;
};

export const getProductsListofBidder = async (
  bidderId,
  limit,
  page,
  sortBy,
  is_active
) => {
  try {
    const bidderProducts = await getProdudctsListByBidderIdRepo(
      bidderId,
      limit,
      page,
      sortBy,
      is_active
    );
    for (let product of bidderProducts) {
      const topBidderId = await getTopBidderIdByProductId(product.product_id);
      if (topBidderId) {
        product.top_bidder = await getUserInfoById(topBidderId);
      } else {
        product.top_bidder = null;
      }

      if (String(topBidderId) === String(bidderId)) {
        product.is_highest_bidder = true;
      } else {
        product.is_highest_bidder = false;
      }

      const historyCount = await countHistoryByProductId(product.product_id);
      product.history_count = historyCount;
    }
    return bidderProducts;
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi lấy danh sách sản phẩm của bidder:",
      err
    );
    throw err;
  }
};

export const getMetaDataForBidderProductsList = async (
  bidderId,
  limit,
  page,
  is_active
) => {
  try {
    const totalProducts = await countProductsByBidderId(bidderId, is_active);
    let limitPerPage = limit;
    if (!limitPerPage || limitPerPage <= 0) {
      limitPerPage = totalProducts; // Default limit
    }
    const totalPages = Math.ceil(totalProducts / limitPerPage);
    let previousPage, nextPage;
    if (page > 1 && page <= totalPages) {
      previousPage = true;
    } else {
      previousPage = false;
    }
    if (page < totalPages) {
      nextPage = true;
    } else {
      nextPage = false;
    }
    const currentPage = page;
    if (page > totalPages && totalProducts > 0) {
      throw new Error("Page number exceeds total pages available");
    }
    return {
      total_products: totalProducts,
      total_pages: totalPages,
      previous_page: previousPage,
      next_page: nextPage,
      current_page: currentPage,
      limit: limitPerPage,
    };
  } catch (err) {
    console.error(
      "❌ [Service] Lỗi khi lấy metadata cho danh sách sản phẩm của bidder:",
      err
    );
    throw err;
  }
};
