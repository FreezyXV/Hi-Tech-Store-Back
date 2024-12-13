// controllers/variantController.js
const { Variant, Model } = require("../models/category");
const AppError = require("../utils/appError");
const asyncHandler = require("../middlewares/asyncHandler");

// Fetch all variants for a specific model
exports.getVariants = asyncHandler(async (req, res, next) => {
  const variants = await Variant.find({ modelId: req.params.modelId }).select(
    "name sku imageUrls price stock color bracelet braceletColor size modem ram chip storage"
  );

  res.status(200).json({ success: true, data: variants });
});

// Fetch a specific variant by ID
exports.getVariantById = asyncHandler(async (req, res, next) => {
  const variant = await Variant.findById(req.params.variantId)
    .populate("modelId", "name imageUrls")
    .select(
      "name sku imageUrls price stock color bracelet braceletColor size modem ram chip storage"
    );

  if (!variant) return next(new AppError("Variant not found", 404));

  res.status(200).json({ success: true, data: variant });
});

// variantsController.js
exports.getVariantsByIds = asyncHandler(async (req, res, next) => {
  const { variantIds } = req.body;
  const variants = await Variant.find({ _id: { $in: variantIds } });
  res.status(200).json({ success: true, data: variants });
});

// Create a new variant under a specific model
exports.createVariant = asyncHandler(async (req, res, next) => {
  const model = await Model.findById(req.params.modelId);
  if (!model) return next(new AppError("Model not found", 404));

  const variant = new Variant({
    ...req.body,
    modelId: req.params.modelId,
  });
  await variant.save();

  model.variants.push(variant._id);
  await model.save();

  res.status(201).json({ success: true, data: variant });
});

// Update a variant
exports.updateVariant = asyncHandler(async (req, res, next) => {
  const variant = await Variant.findByIdAndUpdate(
    req.params.variantId,
    req.body,
    { new: true, runValidators: true }
  );
  if (!variant) return next(new AppError("Variant not found", 404));

  res.status(200).json({ success: true, data: variant });
});

// Delete a variant
exports.deleteVariant = asyncHandler(async (req, res, next) => {
  const variant = await Variant.findByIdAndDelete(req.params.variantId);
  if (!variant) return next(new AppError("Variant not found", 404));

  await Model.findByIdAndUpdate(variant.modelId, {
    $pull: { variants: req.params.variantId },
  });

  res.status(200).json({ success: true, message: "Variant deleted" });
});

// Fetch variant details for the cart
exports.getVariantForCart = asyncHandler(async (req, res, next) => {
  const variant = await Variant.findById(req.params.variantId).select(
    "name price imageUrls stock"
  );
  if (!variant) return next(new AppError("Variant not found", 404));

  res.status(200).json({ success: true, data: variant });
});

// Fetch detailed variant information for the cart
exports.getVariantDetailsForCart = asyncHandler(async (req, res, next) => {
  const variant = await Variant.findById(req.params.variantId).populate(
    "modelId",
    "name imageUrls"
  );
  if (!variant) return next(new AppError("Variant not found", 404));

  res.status(200).json({ success: true, data: variant });
});
