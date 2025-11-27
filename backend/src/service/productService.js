import dotenv from 'dotenv';
dotenv.config();

import "../model/productModel.js";
import {
    getHighestPricedProducts as getHighestPricedProductsRepo,
    getTopCurrentProducts as getTopCurrentProductsRepo,
    getMostBiddedProducts as getMostBiddedProductsRepo,
    getProductsByCategory as getProductsByCategoryRepo,
    getProductBaseInfoById as getProductBaseInfoByIdRepo,
    getProductImages as getProductImagesRepo,
    otherProductsByCategory as otherProductsByCategoryRepo,
    getAllProducts as getAllProductsRepo
} from '../repo/productRepo.js';

import {
    getBidHistoryByProductId,
    getHighestBidInfoofUserOnProduct,
    getTopBidderIdByProductId,
    countHistoryByProductId
} from '../repo/bidderRepo.js';

import { getUserInfoById } from '../repo/userRepo.js';


export const getHighestPricedProducts = async (limit = 5) => {
    const products = await getHighestPricedProductsRepo(limit);
    if (!products) {
        throw new Error('No products found');
    }
    return products;
}

export const getTopCurrentProducts = async (limit = 5) => {
    const products = await getTopCurrentProductsRepo(limit);
    if (!products) {
        throw new Error('No products found');
    }
    return products;
}

export const getMostBiddedProducts = async (limit = 5) => {
    const products = await getMostBiddedProductsRepo(limit);
    if (!products) {
        throw new Error('No products found');
    }
    return products;
}

export const getAllProducts = async (limit = 5, page = 1) => {
    const products = await getAllProductsRepo(limit, page);
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
        throw new Error('No products found');
    }
    return products;
}


export const getProductsByCategory = async (categoryId) => {
    const products = await getProductsByCategoryRepo(categoryId);
    if (!products) {
        throw new Error('No products found for this category');
    }
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
    return products;
}

export const getProductDetailsById = async (productId, limit, user) => {
    const productInfo = await getProductBaseInfoByIdRepo(productId);
    if (!productInfo) {
        throw new Error('Product not found');
    }

    const productImages = await getProductImagesRepo(productId);
    const bidHistory = await getBidHistoryByProductId(productId);
    const topBidderId = await getTopBidderIdByProductId(productId);
    const topBidderInfo = topBidderId ? await getUserInfoById(topBidderId) : null;
    const sellerInfo = await getUserInfoById(productInfo.seller_id);
    const otherProducts = await otherProductsByCategoryRepo(productInfo.category_id, productId, limit);

    for (let prod of otherProducts) {
        const countHistory = await countHistoryByProductId(prod.product_id);
        prod.history_count = countHistory;
        const top_bidder_id = await getTopBidderIdByProductId(prod.product_id);
        if (top_bidder_id) {
            const top_bidder_info = await getUserInfoById(top_bidder_id);
            prod.top_bidder = {
                name: top_bidder_info.username,
            }
        } else {
            prod.top_bidder = null;
        } 
    }

    otherProducts.map(prod => otherProductsInfo(
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
    ));

    let userHighestBidInfo = null;
    if (user && user.role == 'bidder') {
        userHighestBidInfo = await getHighestBidInfoofUserOnProduct(productId, user.user_id);
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
        otherProducts: otherProducts
    };  
}



