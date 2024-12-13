//specController.js 
exports.getSpecifications = async (req, res) => {
  try {
    const { variantId } = req.query;

    if (!variantId) {
      return res.status(400).json({ message: 'Variant ID is required' });
    }

    const product = await Product.findOne({ 'variant._id': variantId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product.specifications);
  } catch (error) {
    console.error('Error fetching specifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
