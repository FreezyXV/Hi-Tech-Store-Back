// controllers/authController.js
const User = require('../models/user');
const { Variant } = require('../models/category');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');
const { findUserOrFail, findUserWithPopulate } = require('../utils/userHelpers');
const errorMessages = require('../utils/errorMessages');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registration Controller
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;

  // Check for existing user
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return next(new AppError(errorMessages.auth.emailOrUsernameExists, 400));
  }

  // Create new user
  const newUser = new User({ email, username, password });
  await newUser.save();

  // Generate JWT token
  const token = generateToken(newUser._id);
  res.status(201).json({
    success: true,
    message: errorMessages.auth.userRegistered,
    token,
    data: newUser
  });
});

// Login Controller
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(errorMessages.auth.invalidCredentials, 400));
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new AppError(errorMessages.auth.invalidCredentials, 400));
  }

  // Generate JWT token
  const token = generateToken(user._id);
  res.status(200).json({
    success: true,
    token,
    data: { id: user._id, email: user.email, username: user.username }
  });
});

// Get Profile Controller
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.userId)
    .select('-password')
    .populate({
      path: 'wishlist',
      select: 'name price imageUrls',
    })
    .populate({
      path: 'orders',
      select: 'totalAmount createdAt status items',
      populate: {
        path: 'items.variant',
        select: 'name price imageUrls',
      },
    });

  if (!user) {
    return next(new AppError(errorMessages.notFound('User'), 404));
  }

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      wishlist: user.wishlist || [],
      orders: user.orders || [],
    }
  });
});

// Change Password Controller
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await findUserOrFail(req.user.userId);

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new AppError(errorMessages.auth.incorrectPassword, 400));
  }

  // Update password
  user.password = newPassword; // Pre-save hook will hash this
  await user.save();

  res.status(200).json({ success: true, message: errorMessages.auth.passwordChanged });
});

// Update User Controller
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { email, username, role } = req.body;
  const user = await findUserOrFail(req.user.userId);

  if (email) user.email = email;
  if (username) user.username = username;
  if (role) user.role = role;

  await user.save();
  res.status(200).json({
    success: true,
    message: errorMessages.auth.profileUpdated,
    data: user
  });
});

// Add to Wishlist Controller
exports.addToUserWishlist = asyncHandler(async (req, res, next) => {
  const { variantId } = req.body;

  if (!variantId) {
    return next(new AppError(errorMessages.required('Variant ID'), 400));
  }

  const variant = await Variant.findById(variantId).select('name price imageUrls');
  if (!variant) {
    return next(new AppError(errorMessages.notFound('Variant'), 404));
  }

  const user = await findUserOrFail(req.user.userId);

  // Check if the variant is already in the wishlist
  const alreadyInWishlist = user.wishlist.some((v) => v.toString() === variantId);
  if (alreadyInWishlist) {
    return res.status(200).json({
      success: true,
      message: errorMessages.wishlist.alreadyExists
    });
  }

  user.wishlist.push(variantId);
  await user.save();

  res.status(200).json({
    success: true,
    message: errorMessages.wishlist.added,
    data: user.wishlist
  });
});

// Remove from Wishlist Controller
exports.removeFromUserWishlist = asyncHandler(async (req, res, next) => {
  const { variantId } = req.params;

  if (!variantId) {
    return next(new AppError(errorMessages.required('Variant ID'), 400));
  }

  const user = await findUserOrFail(req.user.userId);

  user.wishlist = user.wishlist.filter(id => id.toString() !== variantId);
  await user.save();

  res.status(200).json({
    success: true,
    message: errorMessages.wishlist.removed
  });
});

// Get User Wishlist Controller
exports.getUserWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user?.userId;

  if (!userId) {
    return next(new AppError('User ID is missing', 400));
  }

  const user = await findUserWithPopulate(userId, {
    path: 'wishlist',
    select: 'name price imageUrls specifications',
  });

  res.status(200).json({
    success: true,
    data: user.wishlist
  });
});
