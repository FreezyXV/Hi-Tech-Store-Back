// controllers/orderController.js
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');
const { Variant } = require('../models/category');
const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/cart');
const OrderService = require('../services/orderService');
const errorMessages = require('../utils/errorMessages');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'Stripe secret key not found. Please define STRIPE_SECRET_KEY in .env'
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
    throw new AppError(errorMessages.order.missingFields, 400);
  }

  // Validate shipping address
  OrderService.validateShippingAddress(shippingAddress);

  // Validate items and calculate total
  const { totalAmount: calculatedTotalAmount, variants } = await OrderService.validateAndCalculateTotal(
    items,
    deliveryMethod,
    'variant'
  );

  // Verify total amount matches
  if (calculatedTotalAmount !== totalAmount) {
    throw new AppError(errorMessages.order.totalMismatch, 400);
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
    status: 'Processing',
    paymentIntentId,
  });

  await order.save();

  // Append order to user's orders array
  const userDoc = await User.findById(req.user.userId);
  userDoc.orders.push(order._id);
  await userDoc.save();

  res.status(201).json({ success: true, data: order });
});

// Fetch a Stripe payment intent
exports.fetchPaymentIntent = asyncHandler(async (req, res) => {
  const { items, totalAmount, deliveryMethod, shippingAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError(errorMessages.order.invalidItems, 400);
  }

  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    throw new AppError(errorMessages.order.invalidTotalAmount, 400);
  }

  // Validate delivery method
  OrderService.validateDeliveryMethod(deliveryMethod);

  // Validate items and calculate total (using 'id' key for variant ID)
  const { totalAmount: calculatedTotalAmount } = await OrderService.validateAndCalculateTotal(
    items,
    deliveryMethod,
    'id'
  );

  // Verify total amount matches
  if (calculatedTotalAmount !== totalAmount) {
    throw new AppError(errorMessages.order.totalMismatch, 400);
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(calculatedTotalAmount * 100),
      currency: 'eur',
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

    res.status(200).json({
      success: true,
      data: { clientSecret: paymentIntent.client_secret }
    });
  } catch (error) {
    throw new AppError(errorMessages.order.paymentFailed, 500);
  }
});

// Create an order from the cart
exports.createOrderFromCart = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.variant',
      'price name'
    );
    if (!cart || !cart.items.length) {
      throw new AppError(errorMessages.cart.empty, 400);
    }

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
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    await session.abortTransaction();
    throw new AppError('Failed to create order from cart', 500);
  } finally {
    session.endSession();
  }
});

// Get a single order by ID
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: 'items.variant',
    select: 'name price imageUrls color storage',
  });

  if (!order) throw new AppError(errorMessages.notFound('Order'), 404);

  res.status(200).json({ success: true, data: order });
});

// Get all orders for a user
exports.getOrdersByUserId = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).populate({
    path: 'items.variant',
    select: 'name price imageUrls color storage',
  });

  res.status(200).json({ success: true, data: orders });
});

// Update order status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError(errorMessages.notFound('Order'), 404);

  order.status = req.body.status;
  await order.save();

  res.status(200).json({ success: true, data: order });
});

// Get all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate({
    path: 'items.variant',
    select: 'name price imageUrls color storage',
  });

  res.status(200).json({ success: true, data: orders });
});
