//modelController.js
const { Model } = require("../models/category");
const AppError = require("../utils/appError");
const asyncHandler = require("../middlewares/asyncHandler");

// Fetch models for a brand
exports.getModels = asyncHandler(async (req, res) => {
  const models = await Model.find({ brandId: req.params.brandId }).select(
    "name imageUrls features variants"
  );
  res.status(200).json({ success: true, data: models });
});

// Fetch a specific model by ID
exports.getModelById = asyncHandler(async (req, res, next) => {
  const model = await Model.findById(req.params.modelId).populate("variants");

  if (!model) return next(new AppError("Model not found", 404));

  res.status(200).json({ success: true, data: model });
});

// Fetch models with startPrice
exports.getModelsWithStartPrice = asyncHandler(async (req, res) => {
  const models = await Model.find({ brandId: req.params.brandId })
    .select("name imageUrls features variants")
    .populate({
      path: "variants",
      select: "price",
    });

  const modelsWithStartPrice = models.map((model) => {
    const startPrice = model.variants?.length
      ? Math.min(...model.variants.map((v) => v.price))
      : null;

    return { ...model.toObject(), startPrice };
  });

  res.status(200).json({ success: true, data: modelsWithStartPrice });
});

// Fetch models by category
exports.getModelsByCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Category ID is required" });
  }

  const models = await Model.find({ categoryId }).select(
    "name imageUrls brandId features variants"
  );

  if (!models.length) {
    return res
      .status(404)
      .json({ success: false, message: "No models found for this category" });
  }

  res.status(200).json({ success: true, data: models });
});

// Create a new model
exports.createModel = asyncHandler(async (req, res) => {
  const model = new Model({ ...req.body, brandId: req.params.brandId });
  await model.save();
  res.status(201).json({ success: true, data: model });
});

// Update a model
exports.updateModel = asyncHandler(async (req, res) => {
  const model = await Model.findByIdAndUpdate(req.params.modelId, req.body, {
    new: true,
  });
  if (!model) throw new AppError("Model not found", 404);
  res.status(200).json({ success: true, data: model });
});

// Delete a model
exports.deleteModel = asyncHandler(async (req, res) => {
  const model = await Model.findByIdAndDelete(req.params.modelId);
  if (!model) throw new AppError("Model not found", 404);
  res.status(200).json({ success: true, message: "Model deleted" });
});
