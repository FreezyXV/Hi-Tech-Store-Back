// controllers/specController.js
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');
const errorMessages = require('../utils/errorMessages');

exports.getSpecifications = asyncHandler(async (req, res) => {
  const { variantId } = req.query;

  if (!variantId) {
    throw new AppError(errorMessages.required('Variant ID'), 400);
  }

  const product = await Product.findOne({ 'variant._id': variantId });

  if (!product) {
    throw new AppError(errorMessages.notFound('Product'), 404);
  }

  res.status(200).json({ success: true, data: product.specifications });
});
