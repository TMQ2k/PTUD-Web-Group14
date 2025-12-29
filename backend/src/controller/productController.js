import express, { json } from "express";
import {
  getProductDetailsById,
  deleteProductById,
  getProductsList,
  postProduct,
  deactiveProduct,
  getProductBidHistoryService,
  getProductBySellerIdService,
  getExpiredProductsService,
} from "../service/productService.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const sortBy = req.query.sortBy;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page) || 1;
    const is_active =
      req.query.is_active === "true"
        ? true
        : req.query.is_active === "false"
        ? false
        : undefined;
    const products = await getProductsList(
      categoryId,
      limit,
      page,
      sortBy,
      is_active
    );
    res.json({
      code: 200,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
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

router.put("/deactivate-expired", async (req, res) => {
  console.log("🚀 Received request to deactivate expired products");
  try {
    const result = await deactiveProduct();
    return res.status(200).json({
      code: 200,
      message: "Expired products deactivated successfully",
      data: result,
    });
  } catch (err) {
    console.error("❌ Error in /deactivate-expired route:", err);
    return res.status(400).json({
      code: 400,
      message: err.message || "Failed to deactivate expired products",
      data: null,
    });
  }
});
router.get("/get/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = req.user; // Assuming user info is attached to the request
    const productDetails = await getProductDetailsById(productId, user);
    res.json({
      code: 200,
      message: "Product details retrieved successfully",
      data: productDetails,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
      data: null,
    });
  }
});

router.post("/", authenticate, authorize("seller"), async (req, res) => {
  try {
    const user = req.user;
    const {
      name,
      description,
      starting_price,
      step_price,
      buy_now_price,
      image_cover_url,
      end_time,
      extra_image_urls,
      category_ids,
    } = req.body;
    const newProduct = await postProduct(
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
    );
    res.status(201).json({
      code: 201,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
      data: null,
    });
  }
});

router.get("/bid-history/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const bidHistory = await getProductBidHistoryService(productId);
    res.json({
      code: 200,
      message: "Bid history retrieved successfully",
      data: bidHistory,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
      data: null,
    });
  }
});

router.get("/seller-products", authenticate, async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await getProductBySellerIdService(sellerId);
    res.json({
      code: 200,
      message: "Seller's products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
      data: null,
    });
  }
});

router.get("/expired-products", async (req, res) => {
  try {
    const expiredProducts = await getExpiredProductsService();
    res.json({
      code: 200,
      message: "Expired products retrieved successfully",
      data: expiredProducts,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
      data: null,
    });
  }
});

export default router;
