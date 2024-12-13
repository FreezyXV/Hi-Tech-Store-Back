//revieuwController.js
// controllers/reviewController.js
const Review = require('../models/Review');

// Get reviews for models or variants
exports.getReviews = async (req, res) => {
  const { modelId, variantId } = req.params;
  try {
    const query = modelId ? { modelId } : { variantId };
    const reviews = await Review.find(query).populate('user', 'username');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  const { modelId, variantId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }

  try {
    const review = new Review({
      modelId,
      variantId,
      user: req.user.userId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};


// Delete a review
exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
  
    try {
      const deletedReview = await Review.findByIdAndDelete(reviewId);
  
      if (!deletedReview) {
        return res.status(404).json({ error: "Review not found" });
      }
  
      res.status(200).json({ message: "Review deleted successfully", review: deletedReview });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  };