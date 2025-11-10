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

  const relevantBrandIds = [
    ...new Set([
      ...brandsInMatchedCategories.map((brand) => brand._id.toString()),
      ...matchedBrandsByName.map((brand) => brand._id.toString()),
    ]),
  ];

  const models = await Model.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { brandId: { $in: relevantBrandIds } },
    ],
  })
    .populate({
      path: 'brandId',
      select: 'name categoryId',
      populate: {
        path: 'categoryId',
        select: 'name',
      },
    })
    .populate('variants');

  const results = models.map((model) => {
    const brand = model.brandId;
    const category = brand?.categoryId;

    return {
      _id: model._id,
      name: model.name,
      brand: {
        id: brand?._id,
        name: brand?.name || 'Unknown Brand',
      },
      category: {
        id: category?._id || category || null,
        name: category?.name || 'Unknown Category',
      },
      imageUrls: model.imageUrls,
      variants: model.variants,
    };
  });

  res.status(200).json({ success: true, data: results });
});
