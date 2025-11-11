import express from 'express';
import {
    getHighestPricedProducts,
    getTopCurrentProducts
} from '../service/productService.js';

const router = express.Router();
router.get('/top-current', async (req, res) => {
    try {
        const limit =  5;
        const products = await getTopCurrentProducts(limit);
        res.status(200).json({
            code: 200,
            message: 'Top current products retrieved successfully',
            data: products
        });
    } catch (err) {
        console.error('❌ Error in /top-current route:', err);
        res.status(404).json({
            code: 404,
            message: err.message || 'No products found',
            data: null
        });
    }
});

router.get('/highest-priced', async (req, res) => {
    try {
        const limit = 5;
        const products = await getHighestPricedProducts(limit);
        res.status(200).json({
            code: 200,
            message: 'Highest priced products retrieved successfully',
            data: products
        });
    } catch (err) {
        console.error('❌ Error in /highest-priced route:', err);
        res.status(404).json({
            code: 404,
            message: err.message || 'No products found',
            data: null
        });
    }
});

export default router;

        