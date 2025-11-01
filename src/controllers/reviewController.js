// controllers/reviewController.js
const Review = require('../models/review');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');
const errorMessages = require('../utils/errorMessages');

// Get reviews for models or variants
exports.getReviews = asyncHandler(async (req, res) => {
  const { modelId, variantId } = req.params;
  const query = modelId ? { modelId } : { variantId };
  const reviews = await Review.find(query).populate('user', 'username');
  res.status(200).json({ success: true, data: reviews });
});

// Add a new review
exports.addReview = asyncHandler(async (req, res) => {
  const { modelId, variantId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    throw new AppError('Rating and comment are required', 400);
  }

  const review = new Review({
    modelId,
    variantId,
    user: req.user.userId,
    rating,
    comment,
  });

  await review.save();
  res.status(201).json({ success: true, data: review, message: errorMessages.review.added });
});

// Delete a review
exports.deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const deletedReview = await Review.findByIdAndDelete(reviewId);

  if (!deletedReview) {
    throw new AppError(errorMessages.notFound('Review'), 404);
  }

  res.status(200).json({ success: true, message: errorMessages.review.deleted, data: deletedReview });
});