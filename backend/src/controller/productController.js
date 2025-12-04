import express, { json } from "express";
import {
  getHighestPricedProducts,
  getTopCurrentProducts,
  getProductsByCategory,
  getProductDetailsById,
  getProductBidHistoryService,
  deleteProductById,
} from "../service/productService.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();
router.get("/top-current/:limit", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const products = await getTopCurrentProducts(limit);
    return res.status(200).json({
      code: 200,
      message: "Top current products retrieved successfully",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in /top-current route:", err);
    return res.status(404).json({
      code: 404,
      message: err.message || "No products found",
      data: null,
    });
  }
});

router.get("/highest-priced/:limit", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const products = await getHighestPricedProducts(limit);
    return res.status(200).json({
      code: 200,
      message: "Highest priced products retrieved successfully",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in /highest-priced route:", err);
    return res.status(404).json({
      code: 404,
      message: err.message || "No products found",
      data: null,
    });
  }
});

router.get("/most-bidded/:limit", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const products = await getMostBiddedProducts(limit);
    return res.status(200).json({
      code: 200,
      message: "Most bidded products retrieved successfully",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in /most-bidded route:", err);
    return res.status(404).json({
      code: 404,
      message: err.message || "No products found",
      data: null,
    });
  }
});

router.get("/:categoryId", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const products = await getProductsByCategory(categoryId);
    return res.status(200).json({
      code: 200,
      message: "Products by category retrieved successfully",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in /category route:", err);
    return res.status(404).json({
      code: 404,
      message: err.message || "No products found for this category",
      data: null,
    });
  }
});

router.get("/details/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const user = req.user || null;
    const productDetails = await getProductDetailsById(productId, user);
    return res.status(200).json({
      code: 200,
      message: "Product details retrieved successfully",
      data: productDetails,
    });
  } catch (err) {
    console.error("❌ Error in /details route:", err);
    return res.status(404).json({
      code: 404,
      message: err.message || "Product not found",
      data: null,
    });
  }
});

router.get("/bid-history/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const bidHistory = await getProductBidHistoryService(productId);
    return res.status(200).json({
      code: 200,
      message: "Product bid history retrieved successfully",
      data: bidHistory,
    });
  } catch (err) {
    console.error("❌ Error in /bid-history route:", err);
    return res.status(404).json({
      code: 404,
      message: err.message || "No bid history found for this product",
      data: null,
    });
  }
});
router.delete("/delete", authenticate, authorize("admin"), async (req, res) => {
  try {
    const productId = req.body.productId;
    const result = await deleteProductById(productId);
    return res.status(200).json({
      code: 200,
      message: "Product deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error("❌ Error in /delete route:", err);
    return res.status(400).json({
      code: 400,
      message: err.message || "Failed to delete product",
      data: null,
    });
  }
});
export default router;
