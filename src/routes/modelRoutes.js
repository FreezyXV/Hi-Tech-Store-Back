//modelRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel,
  getModelsByCategory,
  getModelsWithStartPrice,
} = require("../controllers/modelController");
const { validateModel } = require("../middlewares/validation");
const asyncHandler = require("../middlewares/asyncHandler");

// Route for models with start price
router.get(
  "/:brandId/models-with-start-price",
  asyncHandler(getModelsWithStartPrice)
);

// Routes for handling models (still nested under brandId)
router.get("/:brandId/models", asyncHandler(getModels));

// Specific model operations
router.get("/:brandId/models/:modelId", asyncHandler(getModelById));
router.post("/:brandId/models", validateModel, asyncHandler(createModel));
router.put(
  "/:brandId/models/:modelId",
  validateModel,
  asyncHandler(updateModel)
);
router.delete("/:brandId/models/:modelId", asyncHandler(deleteModel));

// If you still need getModelsByCategory, consider moving it elsewhere or adjusting its parameter
router.get("/:categoryId/all-models", asyncHandler(getModelsByCategory));

module.exports = router;
