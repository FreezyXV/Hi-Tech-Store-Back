// controllers/searchController.js
const { Category, Brand, Model } = require('../models/category');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');

exports.searchModels = asyncHandler(async (req, res) => {
  const query = req.query.q;

  if (!query) {
    throw new AppError('No search query provided', 400);
  }

  const matchedCategories = await Category.find({
    name: { $regex: query, $options: 'i' },
  });

  const categoryIds = matchedCategories.map((category) => category._id);
  const brandsInMatchedCategories = await Brand.find({
    categoryId: { $in: categoryIds },
  });

  const matchedBrandsByName = await Brand.find({
    name: { $regex: query, $options: 'i' }
  });

  const models = await Model.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      {
        brandId: { $in: brandsInMatchedCategories.map((brand) => brand._id) },
      },
      {
        brandId: { $in: matchedBrandsByName.map((brand) => brand._id) },
      },
    ],
  })
    .populate('brandId')
    .populate('variants');

  const results = models.map((model) => ({
    _id: model._id,
    name: model.name,
    brand: model.brandId.name,
    category: model.brandId.categoryId.name,
    imageUrls: model.imageUrls,
    variants: model.variants,
  }));

  res.status(200).json({ success: true, data: results });
});
