//cartController.js
const Cart = require("../models/cart");
const { Variant } = require("../models/category");
const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/appError");

// Add item to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { variantId, quantity } = req.body;

  if (!variantId || quantity < 1)
    throw new AppError("Invalid variantId or quantity", 400);

  const variant = await Variant.findById(variantId);
  if (!variant) throw new AppError("Variant not found", 404);
  if (quantity > variant.stock)
    throw new AppError("Insufficient stock available", 400);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existingItem = cart.items.find(
    (item) => item.variant.toString() === variantId
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ variant: variantId, quantity });
  }

  await cart.save();
  res.status(200).json({ success: true, cart });
});

// Get user's cart
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.variant",
    "name price imageUrls"
  );
  res.status(200).json({ success: true, items: cart ? cart.items : [] });
});

// Clear user's cart
exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });
  res.status(200).json({ success: true, message: "Cart cleared" });
});
