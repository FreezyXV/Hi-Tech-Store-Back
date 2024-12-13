//brandController.js
const { Brand, Model } = require('../models/category');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');

// Get all brands by category ID
exports.getBrandsByCategoryId = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const brands = await Brand.find({ categoryId }).populate('models');
  if (!brands.length) throw new AppError('Brands not found for this category', 404);

  res.status(200).json({ success: true, data: brands });
});

// Get all models by brand ID
exports.getModelsByBrandId = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  const models = await Model.find({ brandId });
  if (!models.length) throw new AppError('Models not found for this brand', 404);

  res.status(200).json({ success: true, data: models });
});

// Get brand by ID
exports.getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) throw new AppError('Brand not found', 404);

  res.status(200).json({ success: true, data: brand });
});

// Create a new brand
exports.createBrand = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const brand = await Brand.create({ ...req.body, categoryId });
  res.status(201).json({ success: true, data: brand });
});

// Update an existing brand
exports.updateBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  const updatedBrand = await Brand.findByIdAndUpdate(brandId, req.body, { new: true, runValidators: true });
  if (!updatedBrand) throw new AppError('Brand not found', 404);

  res.status(200).json({ success: true, data: updatedBrand });
});

// Delete a brand
exports.deleteBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  const deletedBrand = await Brand.findByIdAndDelete(brandId);
  if (!deletedBrand) throw new AppError('Brand not found', 404);

  res.status(200).json({ success: true, message: 'Brand deleted successfully' });
});
