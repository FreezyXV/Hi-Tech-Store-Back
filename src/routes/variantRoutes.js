// variantRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariantForCart,
  getVariantDetailsForCart,
} = require("../controllers/variantController");
const { validateVariant } = require("../middlewares/validation");
const asyncHandler = require("../middlewares/asyncHandler");

// Fetch all variants for a model
router.get("/", asyncHandler(getVariants));

// Fetch a specific variant by ID
router.get("/:variantId", asyncHandler(getVariantById));

// Create a new variant for a model
router.post("/", validateVariant, asyncHandler(createVariant));

// Fetch a variant for the cart using category, brand, and model IDs
router.get("/:variantId/cart", asyncHandler(getVariantForCart));
router.get(
  "/:variantId/details-for-cart",
  asyncHandler(getVariantDetailsForCart)
);

// Update a variant
router.put("/:variantId", validateVariant, asyncHandler(updateVariant));

// Delete a variant
router.delete("/:variantId", asyncHandler(deleteVariant));

module.exports = router;
