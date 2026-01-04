import {
  getSellerStartTimeService,
  deactivateAllSellerExpiredService,
  sellerRejectBidderService,
  sellerDeleteBannedBidderService,
  sellerAllowBidderService,
  getAllRequestsService,
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

router.post(
  "/seller-reject-bidder",
  authenticate,
  authorize("seller"),
  async (req, res) => {
    try {
      const { productId, bidderId, reason } = req.body;
      const sellerId = req.user.id;
      const result = await sellerRejectBidderService(
        productId,
        sellerId,
        bidderId,
        reason
      );
      res.status(200).json({
        code: 200,
        message: "Successfully rejected bidder",
        data: result,
      });
    } catch (err) {
      console.error("❌ Error in /seller-reject-bidder route:", err);
      res.status(400).json({
        code: 400,
        message: err.message || "Failed to reject bidder",
        data: null,
      });
    }
  }
);

router.delete(
  "/seller-delete-banned-bidder",
  authenticate,
  authorize("seller"),
  async (req, res) => {
    try {
      const { productId, bidderId } = req.body;
      const sellerId = req.user.id;
      const result = await sellerDeleteBannedBidderService(
        productId,
        sellerId,
        bidderId
      );
      res.status(200).json({
        code: 200,
        message: "Successfully deleted banned bidder",
        data: result,
      });
    } catch (err) {
      console.error("❌ Error in /seller-delete-banned-bidder route:", err);
      res.status(400).json({
        code: 400,
        message: err.message || "Failed to delete banned bidder",
        data: null,
      });
    }
  }
);

router.post(
  "/seller-allow-bidder",
  authenticate,
  authorize("seller"),
  async (req, res) => {
    try {
      const { productId, bidderId } = req.body;
      const sellerId = req.user.id;
      const result = await sellerAllowBidderService(
        productId,
        sellerId,
        bidderId
      );
      res.status(200).json({
        code: 200,
        message: "Successfully allowed bidder",
        data: result,
      });
    } catch (err) {
      console.error("❌ Error in /seller-allow-bidder route:", err);
      res.status(400).json({
        code: 400,
        message: err.message || "Failed to allow bidder",
        data: null,
      });
    }
  }
);

router.get(
  "/all-requests/:id",
  authenticate,
  authorize("seller"),
  async (req, res) => {
    try {
      const sellerId = req.user.id;
      const productId = req.params.id;
      const result = await getAllRequestsService(sellerId, productId);
      res.status(200).json({
        code: 200,
        message: "Successfully retrieved all requests",
        data: result,
      });
    } catch (err) {
      console.error("❌ Error in /all-requests/:id route:", err);
      res.status(400).json({
        code: 400,
        message: err.message || "Failed to retrieve all requests",
        data: null,
      });
    }
  }
);

export default router;
