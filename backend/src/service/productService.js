import dotenv from 'dotenv';
dotenv.config();
import {
    getHighestPricedProducts as getHighestPricedProductsRepo,
    getTopCurrentProducts as getTopCurrentProductsRepo,
    getProductsByCategory as getProductsByCategoryRepo
} from '../repo/productRepo.js';

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

export const getProductsByCategory = async (categoryId) => {
    const products = await getProductsByCategoryRepo(categoryId);
    if (!products) {
        throw new Error('No products found for this category');
    }
    return products;
}

