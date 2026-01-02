import express from "express";
import {
  addProductToWatchlist,
  getUserWatchlistService,
  getAllBidderInfosByProductId,
  removeProductFromWatchlist,
  updateAutoBidCurrentAmountService,
  upsertAutoBidService,
  requestUpgradeToSellerService,
  getUpgradeRequestsService,
  handleUpgradeRequestService,
  requestBidderOnProductService,
  isBidsOnProductService,
} from "../service/bidderService.js";
import { authenticate, authorize } from "../middleware/auth.js";

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
  console.log(
    "🚀 ~ file: bidderController.js:70 ~ router.get ~ req.user:",
    req.user
  );
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

router.put("/auto-bid", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, maxBidAmount } = req.body;
    const autoBidEntry = await upsertAutoBidService(
      userId,
      productId,
      maxBidAmount
    );
    res.status(200).json({
      code: 200,
      message: "Auto bid added/updated successfully",
      data: autoBidEntry,
    });
  } catch (err) {
    console.error("Error in /auto-bid route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to add/update auto bid",
      data: null,
    });
  }
});

router.put("/auto-bid/update/:productId", async (req, res) => {
  console.log(
    "🚀 ~ file: bidderController.js:138 ~ router.put ~ req.params:",
    req.params
  );
  try {
    const { productId } = req.params;
    const updatedBids = await updateAutoBidCurrentAmountService(productId);
    res.status(200).json({
      code: 200,
      message: "Auto bid current amounts updated successfully",
      data: updatedBids,
    });
  } catch (err) {
    console.error("Error in /auto-bid/update/:productId route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to update auto bid current amounts",
      data: null,
    });
  }
});

router.post(
  "/request-upgrade",
  authenticate,
  authorize("bidder"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const requestResult = await requestUpgradeToSellerService(userId);
      res.status(200).json({
        code: 200,
        message: "Upgrade request submitted successfully",
        data: requestResult,
      });
    } catch (err) {
      console.error("Error in /request-upgrade route:", err);
      res.status(400).json({
        code: 400,
        message: err.message || "Failed to submit upgrade request",
        data: null,
      });
    }
  }
);

router.get(
  "/upgrade-requests",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const requests = await getUpgradeRequestsService();
      res.status(200).json({
        code: 200,
        message: "Upgrade requests retrieved successfully",
        data: requests,
      });
    } catch (err) {
      console.error("Error in /upgrade-requests route:", err);
      res.status(400).json({
        code: 400,
        message: err.message || "Failed to retrieve upgrade requests",
        data: null,
      });
    }
  }
);

router.post(
  "/handle-upgrade-request",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { userId, approve } = req.body;
      const result = await handleUpgradeRequestService(userId, approve);
      res.status(200).json({
        code: 200,
        message: "Upgrade request handled successfully",
        data: result,
      });
    } catch (err) {
      console.error("Error in /handle-upgrade-request route:", err);
      res.status(400).json({
        code: 400,
        message: err.message || "Failed to handle upgrade request",
        data: null,
      });
    }
  }
);

router.post(
  "/request-bidder-on-product",
  authenticate,
  authorize("bidder"),
  async (req, res) => {
    try {
      const bidderId = req.user.id;
      const { productId, reason } = req.body;
      const result = await requestBidderOnProductService(
        productId,
        bidderId,
        reason
      );
      res.status(200).json({
        code: 200,
        message: "Bidder request on product submitted successfully",
        data: result,
      });
    } catch (err) {
      console.error("Error in /request-bidder-on-product route:", err);
      res.status(400).json({
        code: 400,
        message: err.message || "Failed to submit bidder request on product",
        data: null,
      });
    }
  }
);

router.get("/bidders/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const bidders = await getAllBidderInfosByProductId(productId);
    res.status(200).json({
      code: 200,
      message: "Bidders retrieved successfully",
      data: bidders,
    });
  } catch (err) {
    console.error("Error in /bidders/:productId route:", err);
    res.status(400).json({
      code: 400,
      message: err.message || "Failed to retrieve bidders",
      data: null,
    });
  }
});

router.get(
  "/is-bids-on-product/:productId",
  authenticate,
  authorize("bidder"),
  async (req, res) => {
    try {
      const bidderId = req.user.id;
      const { productId } = req.params;
      const result = await isBidsOnProductService(productId, bidderId);
      res.status(200).json({
        code: 200,
        message: "Checked bids on product successfully",
        data: result,
      });
    } catch (err) {
      console.error("Error in /is-bids-on-product/:productId route:", err);
      res.status(400).json({
        code: 400,
        message: err.message || "Failed to check bids on product",
        data: null,
      });
    }
  }
);

router.put(
  "/buy-now/:productId",
  authenticate,
  authorize("bidder"),
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const user = req.user;
      const result = await deactiveProductById(user,productId);
      return res.status(200).json({
        code: 200,
        message: "Product deactivated successfully",
        data: result,
      });
    }
    catch (err) {
      console.error("❌ Error in /:productId/deactivate route:", err);
      return res.status(400).json({
        code: 400,
        message: err.message || "Failed to deactivate product",
        data: null,
      });
    }
  }
);

export default router;
