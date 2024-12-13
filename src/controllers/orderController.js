// orderController.js
const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/appError");
const { Variant } = require("../models/category");
const Order = require("../models/order");
const User = require("../models/user");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Stripe secret key not found. Please define STRIPE_SECRET_KEY in .env"
  );
}

// Create a new order AFTER payment is confirmed on the frontend
exports.createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    totalAmount,
    deliveryMethod,
    paymentIntentId,
  } = req.body;

  if (
    !items ||
    !items.length ||
    !shippingAddress ||
    !deliveryMethod ||
    !paymentIntentId
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided." });
  }

  const variantIds = items.map((item) => item.variant);
  const variants = await Variant.find({ _id: { $in: variantIds } });

  if (variants.length !== items.length) {
    return res
      .status(400)
      .json({ error: "Invalid or missing variants in order items." });
  }

  const baseTotalAmount = items.reduce((sum, item) => {
    const variant = variants.find((v) => v._id.toString() === item.variant);
    if (!variant) throw new AppError("Invalid variant in order items", 400);
    return sum + variant.price * item.quantity;
  }, 0);

  const deliveryOptions = { standard: 5, express: 15 };
  const deliveryCost = deliveryOptions[deliveryMethod.toLowerCase()];
  if (deliveryCost === undefined) {
    return res.status(400).json({ error: "Invalid delivery method" });
  }

  const calculatedTotalAmount = baseTotalAmount + deliveryCost;
  if (calculatedTotalAmount !== totalAmount) {
    return res.status(400).json({ error: "Total amount mismatch" });
  }

  const order = new Order({
    user: req.user.userId,
    items: items.map((item) => ({
      variant: item.variant,
      quantity: item.quantity,
      price: variants.find((v) => v._id.toString() === item.variant).price,
    })),
    shippingAddress: {
      fullName: shippingAddress.fullName,
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
    },
    totalAmount: calculatedTotalAmount,
    status: "Processing",
    paymentIntentId,
  });

  await order.save();

  // Append order to user's orders array
  const userDoc = await User.findById(req.user.userId);
  userDoc.orders.push(order._id);
  await userDoc.save();

  res.status(201).json({ success: true, order });
});

// Fetch a Stripe payment intent
exports.fetchPaymentIntent = asyncHandler(async (req, res) => {
  const { items, totalAmount, deliveryMethod, shippingAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order items are required." });
  }

  if (typeof totalAmount !== "number" || totalAmount <= 0) {
    return res
      .status(400)
      .json({ error: "Total amount must be a positive number." });
  }

  if (
    !deliveryMethod ||
    !["standard", "express"].includes(deliveryMethod.toLowerCase())
  ) {
    return res
      .status(400)
      .json({
        error: "Delivery method must be either 'standard' or 'express'.",
      });
  }

  const variantIds = items.map((item) => item.id);
  const variants = await Variant.find({ _id: { $in: variantIds } });

  if (variants.length !== items.length) {
    return res
      .status(400)
      .json({ error: "One or more variants in the order items are invalid." });
  }

  const baseTotalAmount = items.reduce((sum, item) => {
    const variant = variants.find((v) => v._id.toString() === item.id);
    if (!variant) {
      throw new AppError(`Variant with ID ${item.id} not found.`, 400);
    }
    return sum + variant.price * item.quantity;
  }, 0);

  const deliveryOptions = { standard: 5, express: 15 };
  const deliveryCost = deliveryOptions[deliveryMethod.toLowerCase()];
  const calculatedTotalAmount = baseTotalAmount + deliveryCost;

  if (calculatedTotalAmount !== totalAmount) {
    return res.status(400).json({ error: "Total amount mismatch." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(calculatedTotalAmount * 100),
      currency: "eur",
      shipping: {
        name: shippingAddress.fullName,
        address: {
          line1: shippingAddress.address,
          city: shippingAddress.city,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment intent." });
  }
});

// Create an order from the cart
exports.createOrderFromCart = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.variant",
      "price name"
    );
    if (!cart || !cart.items.length) throw new AppError("Cart is empty", 400);

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );

    const order = new Order({
      user: req.user._id,
      items: cart.items.map((item) => ({
        variant: item.variant._id,
        quantity: item.quantity,
      })),
      totalAmount,
    });

    await order.save({ session });
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    res.status(201).json({ success: true, order });
  } catch (error) {
    await session.abortTransaction();
    throw new AppError("Failed to create order from cart", 500);
  } finally {
    session.endSession();
  }
});

// Get a single order by ID
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: "items.variant",
    select: "name price imageUrls color storage",
  });

  if (!order) throw new AppError("Order not found", 404);

  res.status(200).json({ success: true, order });
});

// Get all orders for a user
exports.getOrdersByUserId = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).populate({
    path: "items.variant",
    select: "name price imageUrls color storage",
  });

  res.status(200).json({ success: true, orders });
});

// Update order status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);

  order.status = req.body.status;
  await order.save();

  res.status(200).json({ success: true, order });
});

// Get all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate({
    path: "items.variant",
    select: "name price imageUrls color storage",
  });

  res.status(200).json({ success: true, orders });
});
