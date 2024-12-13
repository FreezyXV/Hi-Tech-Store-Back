const express = require("express");
const {
  getReviews,
  addReview,
  deleteReview,
} = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Get reviews
router.get("/models/:modelId", getReviews);
router.get("/variants/:variantId", getReviews);

// Add a review
router.post("/models/:modelId", authMiddleware, addReview);
router.post("/variants/:variantId", authMiddleware, addReview);

// Delete a review
router.delete("/:reviewId", authMiddleware, deleteReview);

module.exports = router;
