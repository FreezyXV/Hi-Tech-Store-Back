//categoryController.js
const { Category, Model } = require("../models/category");
const redisClient = require("../utils/redisClient");
const asyncHandler = require("../middlewares/asyncHandler");

exports.getCategories = asyncHandler(async (req, res) => {
  const cacheKey = `categories:all`;

  try {
    const cachedCategories = await redisClient.get(cacheKey);
    if (cachedCategories) {
      return res.status(200).json(JSON.parse(cachedCategories));
    }

    // Fetch categories from the database
    const categories = await Category.find({}).select(
      "name imageUrls description"
    );
    const response = {
      success: true,
      data: categories,
    };

    await redisClient.set(cacheKey, JSON.stringify(response), "EX", 300);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
});

// Fetch all models for a category
exports.getAllModelsByCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Category ID is required" });
  }

  const models = await Model.find({ categoryId }).select(
    "name imageUrls brandId features"
  );

  if (!models || models.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "No models found for this category" });
  }

  res.status(200).json({ success: true, data: models });
});

// Fetch a category by ID and include its brands
exports.getCategoryWithBrands = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId).populate(
    "brands"
  );
  if (!category) throw new AppError("Category not found", 404);
  res.status(200).json({ success: true, data: category });
});

// Fetch models for a specific category
exports.getModelsByCategory = asyncHandler(async (req, res) => {
  console.log("Fetching models for category:", req.params.categoryId);
  const models = await Model.find({ categoryId: req.params.categoryId }).select(
    "name imageUrls"
  );
  res.status(200).json({ success: true, data: models });
});

// Create a new category
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// Update a category
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    { new: true }
  );
  if (!category) throw new AppError("Category not found", 404);
  res.status(200).json({ success: true, data: category });
});

// Delete a category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.categoryId);
  if (!category) throw new AppError("Category not found", 404);
  res.status(200).json({ success: true, message: "Category deleted" });
});
