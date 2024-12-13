const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithBrands,
  getModelsByCategory,
  getAllModelsByCategory,
} = require("../controllers/categoryController");
const { validateCategory } = require("../middlewares/validation");
const asyncHandler = require("../middlewares/asyncHandler");

// Fetch all categories with pagination
router.get("/", asyncHandler(getCategories));

// Fetch a specific category by ID along with its brands
router.get("/:categoryId", asyncHandler(getCategoryWithBrands));

// Fetch a limited number of models for a specific category (limit to 4)
router.get("/:categoryId/models", asyncHandler(getModelsByCategory));

// Create a new category
router.post("/", validateCategory, asyncHandler(createCategory));

// Update an existing category by ID
router.put("/:categoryId", validateCategory, asyncHandler(updateCategory));

// Delete a category by ID
router.delete("/:categoryId", asyncHandler(deleteCategory));

// Fetch all models for a specific category with pagination
router.get("/:categoryId/all-models", asyncHandler(getAllModelsByCategory));

module.exports = router;
