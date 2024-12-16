// routes/brandRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getBrandsByCategoryId,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getModelsWithStartPrice,
} = require("../controllers/brandController");
const { validateBrand } = require("../middlewares/validation");
const asyncHandler = require("../middlewares/asyncHandler");

// Fetch all brands for a specific category
router.get("/", asyncHandler(getBrandsByCategoryId));

// Fetch a specific brand by ID
router.get("/:brandId", asyncHandler(getBrandById));

// Create a new brand
router.post("/", validateBrand, asyncHandler(createBrand));

// Update a brand
router.put("/:brandId", validateBrand, asyncHandler(updateBrand));

// Delete a brand
router.delete("/:brandId", asyncHandler(deleteBrand));

// Fetch models with start price for a brand
router.get("/:brandId/models-with-start-price", asyncHandler(getModelsWithStartPrice));

module.exports = router;
