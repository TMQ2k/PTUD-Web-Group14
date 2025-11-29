import express from "express";
import {
  addProductToWatchlist,
  getUserWatchlistService,
  removeProductFromWatchlist,
} from "../service/bidderService.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.post("/add-to-watchlist", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const { productId } = req.body;
    const watchlistEntry = await addProductToWatchlist(userId, productId);
    res.status(200).json({
      code: 200,
      message: "Product added to watchlist successfully",
      data: watchlistEntry,
    });
  } catch (err) {
    console.error("Error in /add-to-watchlist route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to add product to watchlist",
      data: null,
    });
  }
});

router.delete("/remove-from-watchlist", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const watchlistEntry = await removeProductFromWatchlist(userId, productId);
    res.status(200).json({
      code: 200,
      message: "Product removed from watchlist successfully",
      data: watchlistEntry,
    });
  } catch (err) {
    console.error("Error in /remove-from-watchlist route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to remove product from watchlist",
      data: null,
    });
  }
});

router.get("/watchlist", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const watchlist = await getUserWatchlistService(userId);
    res.status(200).json({
      code: 200,
      message: "User watchlist retrieved successfully",
      data: watchlist,
    });
  } catch (err) {
    console.error("Error in /watchlist route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to retrieve user watchlist",
      data: null,
    });
  }
});
export default router;
