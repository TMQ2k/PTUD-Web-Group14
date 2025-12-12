import express, {json} from "express";
import { getProductListByQuery } from "../service/productService.js";

const router = express.Router();
router.get("/products", async (req, res) => {
    try {
        const search = req.query.q || "";
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const sortBy = req.query.sortBy || "endtime_desc";
        const is_active = req.query.is_active !== undefined ? req.query.is_active : undefined;
        const products = await getProductListByQuery(search, limit, page, sortBy, is_active);
        res.status(200).json({
            code: 200, 
            message: "Products retrieved successfully",
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message,
            data: null,
        });
    }
});

export default router;