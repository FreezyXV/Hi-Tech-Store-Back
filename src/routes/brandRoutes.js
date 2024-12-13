// brandRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getBrandsByCategoryId,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
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

module.exports = router;
