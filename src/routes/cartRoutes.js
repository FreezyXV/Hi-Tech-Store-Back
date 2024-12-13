const express = require("express");
const {
  addToCart,
  getCart,
  clearCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.use(authMiddleware);

router.post("/add", asyncHandler(addToCart));
router.get("/", asyncHandler(getCart));
router.delete("/", asyncHandler(clearCart));

module.exports = router;
