import express from "express";
import { getAllCategories } from "../service/categoryService.js";
const router = express.Router();
router.get("/categories", async (req, res) => {
    try {
        const categories = await getAllCategories();
        return res.status(200).json({
            code: 200,
            message: "Categories retrieved successfully",
            data: categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(404).json({
            code: 404,
            message: "Categories not found",
            data: null
        });
    }
});
export default router;