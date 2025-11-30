import express, { json } from "express";
import {
    getSearchProducts,
    getProductsList,
    getProductDetailsById,
    postProduct
} from '../service/productService.js';
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        const sortBy = req.query.sortBy;
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page) || 1;
        const is_active = req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined;
        const products = await getProductsList(categoryId, limit, page, sortBy, is_active);
        res.json({
            code: 200,
            message: 'Products retrieved successfully',
            data: products
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: error.message,
            data: null
        });
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const limit = parseInt(req.query.limit);
        const user = req.user; // Assuming user info is attached to the request
        const productDetails = await getProductDetailsById(productId, limit, user);
        res.json({
            code: 200,
            message: 'Product details retrieved successfully',
            data: productDetails
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: error.message,
            data: null
        });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const user = req.user; 
        const { name, description, starting_price, step_price, buy_now_price, image_cover_url, end_time, extra_image_urls } = req.body;
        const newProduct = await postProduct(user, name, description, starting_price, step_price, buy_now_price, image_cover_url, end_time, extra_image_urls);
        res.status(201).json({
            code : 201,
            message : 'Product created successfully',
            data : newProduct
        });
    } catch (error) {   
        res.status(500).json({ 
            code: 500,
            message: error.message,
            data: null
        });
    }  
});

export default router;
