// controllers/variantController.js
const { Variant, Model } = require("../models/category");
const AppError = require("../utils/appError");
const asyncHandler = require("../middlewares/asyncHandler");
const redisClient = require("../utils/redisClient");

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

  if (!variantIds || !Array.isArray(variantIds) || variantIds.length === 0) {
    return next(new AppError("Variant IDs are required", 400));
  }

  const cacheKey = `variants:batch:${variantIds.sort().join(',')}`;

  try {
    // Only use cache if Redis is available
    if (redisClient) {
      const cachedVariants = await redisClient.get(cacheKey);
      if (cachedVariants) {
        return res.status(200).json(JSON.parse(cachedVariants));
      }
    }

    const variants = await Variant.find({ _id: { $in: variantIds } }).select(
      "name sku imageUrls price stock color bracelet braceletColor size modem ram chip storage"
    );

    const response = { success: true, data: variants };

    // Cache for 5 minutes if Redis is available
    if (redisClient) {
      await redisClient.set(cacheKey, JSON.stringify(response), "EX", 300);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching variants by IDs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching variants",
    });
  }
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
