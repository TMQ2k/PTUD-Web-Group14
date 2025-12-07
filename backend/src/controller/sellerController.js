import {
  getSellerStartTimeService,
  deactivateAllSellerExpiredService,
} from "../service/sellerService.js";
import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();
router.put("/deactivate-expired-sellers", async (req, res) => {
  try {
    const result = await deactivateAllSellerExpiredService();
    res.status(200).json({
      code: 200,
      message: "Successfully deactivated expired sellers",
      data: result,
    });
  } catch (err) {
    console.error("❌ Error in /deactivate-expired-sellers route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to deactivate expired sellers",
      data: null,
    });
  }
});
router.get("/seller-start-time", authenticate, async (req, res) => {
  try {
    const sellerId = req.user.id;
    const result = await getSellerStartTimeService(sellerId);
    res.status(200).json({
      code: 200,
      message: "Successfully retrieved seller start time",
      data: result,
    });
  } catch (err) {
    console.error("❌ Error in /seller-start-time/:sellerId route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to retrieve seller start time",
      data: null,
    });
  }
});
export default router;
