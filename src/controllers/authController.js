
// //authController.js
// const { validationResult } = require('express-validator');
// const User = require('../models/user');
// const { Variant } = require('../models/category');
// const asyncHandler = require('../middlewares/asyncHandler');
// const AppError = require('../utils/appError');
// const jwt = require('jsonwebtoken');

// const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// const handleErrors = (res, error, statusCode = 500) => {
//   console.error(error);
//   res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
// };

// exports.registerUser = async (req, res) => {
//   const { email, username, password } = req.body;

//   try {

//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email or Username already exists' });
//     }


//     const newUser = new User({ email, username, password });
//     await newUser.save();

//     const token = generateToken(newUser._id); // Generate JWT token
//     return res.status(201).json({ message: 'User registered successfully', token, user: newUser });
//   } catch (error) {
//     handleErrors(res, error);
//   }
// };


// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const token = generateToken(user._id);
//     res.status(200).json({ token, user: { id: user._id, email: user.email, username: user.username } });
//   } catch (err) {
//     handleErrors(res, err);
//   }
// };


// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//       .select('-password')
//       .populate({
//         path: 'wishlist',
//         select: 'name price imageUrls'
//       })
//       .populate({
//         path: 'orders',
//         select: 'totalAmount createdAt status items',
//         populate: {
//           path: 'items.variant',
//           select: 'name price imageUrls', 
//         }
//       });

//     if (!user) return res.status(404).json({ error: 'User not found' });

//     res.status(200).json({
//       id: user._id,
//       username: user.username,
//       email: user.email,
//       createdAt: user.createdAt,
//       wishlist: user.wishlist || [],
//       orders: user.orders || []
//     });
//   } catch (error) {
//     handleErrors(res, error);
//   }
// };




// exports.changePassword = async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const isMatch = await user.matchPassword(currentPassword);
//     if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

//     user.password = newPassword; // Pre-save hook will hash this
//     await user.save();

//     res.status(200).json({ message: 'Password changed successfully' });
//   } catch (error) {
//     handleErrors(res, error);
//   }
// };

// exports.updateUser = async (req, res) => {
//   const { email, username, role } = req.body;
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     if (email) user.email = email;
//     if (username) user.username = username;
//     if (role) user.role = role;

//     await user.save();
//     res.status(200).json({ message: 'User updated successfully', user });
//   } catch (error) {
//     handleErrors(res, error);
//   }
// };


// exports.addToUserWishlist = asyncHandler(async (req, res) => {
//   try {
//     const { variantId } = req.body;

//     if (!variantId) {
//       return res.status(400).json({ error: 'Variant ID is required' });
//     }

//     console.log('Received variantId:', variantId);

//     const variant = await Variant.findById(variantId).select('name price imageUrls');
//     if (!variant) {
//       return res.status(404).json({ error: 'Variant not found' });
//     }

//     const user = await User.findById(req.user.userId);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Check if the variant is already in the wishlist
//     const alreadyInWishlist = user.wishlist.some((v) => v.toString() === variantId);
//     if (alreadyInWishlist) {
//       return res.status(200).json({ message: 'Variant already in wishlist' });
//     }

//     user.wishlist.push(variantId);
//     await user.save();

//     console.log('Updated wishlist:', user.wishlist);

//     res.status(200).json({ message: 'Variant added to wishlist', wishlist: user.wishlist });
//   } catch (error) {
//     console.error('Error adding to wishlist:', error.message);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });


// exports.removeFromUserWishlist = asyncHandler(async (req, res) => {
//   const { variantId } = req.params;
//   if (!variantId) return res.status(400).json({ error: "Variant ID is required" });

//   const user = await User.findById(req.user.userId);
//   if (!user) return res.status(404).json({ error: "User not found" });

//   user.wishlist = user.wishlist.filter(id => id.toString() !== variantId);
//   await user.save();

//   res.status(200).json({ message: "Variant removed from wishlist" });
// });

// exports.getUserWishlist = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.user?.userId; // Ensure userId exists

//     if (!userId) {
//       console.error("Error: Missing userId in request.");
//       return res.status(400).json({ error: 'User ID is missing' });
//     }

//     console.log("Fetching wishlist for userId:", userId);

//     const user = await User.findById(userId).populate({
//       path: 'wishlist',
//       select: 'name price imageUrls specifications', // Fields to populate
//     });

//     if (!user) {
//       console.error("Error: User not found.");
//       return res.status(404).json({ error: 'User not found' });
//     }

//     console.log("Fetched wishlist:", user.wishlist);

//     res.status(200).json({ wishlist: user.wishlist });
//   } catch (error) {
//     console.error("Error fetching wishlist:", error.message);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });


// controllers/authController.js
const User = require('../models/user');
const { Variant } = require('../models/category');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');
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
    return next(new AppError('Email or Username already exists', 400));
  }

  // Create new user
  const newUser = new User({ email, username, password });
  await newUser.save();

  // Generate JWT token
  const token = generateToken(newUser._id);
  res.status(201).json({ message: 'User registered successfully', token, user: newUser });
});

// Login Controller
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Invalid email or password', 400));
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password', 400));
  }

  // Generate JWT token
  const token = generateToken(user._id);
  res.status(200).json({ token, user: { id: user._id, email: user.email, username: user.username } });
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
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    wishlist: user.wishlist || [],
    orders: user.orders || [],
  });
});

// Change Password Controller
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 400));
  }

  // Update password
  user.password = newPassword; // Pre-save hook will hash this
  await user.save();

  res.status(200).json({ message: 'Password changed successfully' });
});

// Update User Controller
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { email, username, role } = req.body;
  const user = await User.findById(req.user.userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (email) user.email = email;
  if (username) user.username = username;
  if (role) user.role = role;

  await user.save();
  res.status(200).json({ message: 'User updated successfully', user });
});

// Add to Wishlist Controller
exports.addToUserWishlist = asyncHandler(async (req, res, next) => {
  const { variantId } = req.body;

  if (!variantId) {
    return next(new AppError('Variant ID is required', 400));
  }

  console.log('Received variantId:', variantId);

  const variant = await Variant.findById(variantId).select('name price imageUrls');
  if (!variant) {
    return next(new AppError('Variant not found', 404));
  }

  const user = await User.findById(req.user.userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if the variant is already in the wishlist
  const alreadyInWishlist = user.wishlist.some((v) => v.toString() === variantId);
  if (alreadyInWishlist) {
    return res.status(200).json({ message: 'Variant already in wishlist' });
  }

  user.wishlist.push(variantId);
  await user.save();

  console.log('Updated wishlist:', user.wishlist);

  res.status(200).json({ message: 'Variant added to wishlist', wishlist: user.wishlist });
});

// Remove from Wishlist Controller
exports.removeFromUserWishlist = asyncHandler(async (req, res, next) => {
  const { variantId } = req.params;
  if (!variantId) {
    return next(new AppError('Variant ID is required', 400));
  }

  const user = await User.findById(req.user.userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.wishlist = user.wishlist.filter(id => id.toString() !== variantId);
  await user.save();

  res.status(200).json({ message: 'Variant removed from wishlist' });
});

// Get User Wishlist Controller
exports.getUserWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user?.userId;

  if (!userId) {
    return next(new AppError('User ID is missing', 400));
  }

  console.log('Fetching wishlist for userId:', userId);

  const user = await User.findById(userId).populate({
    path: 'wishlist',
    select: 'name price imageUrls specifications', // Fields to populate
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  console.log('Fetched wishlist:', user.wishlist);

  res.status(200).json({ wishlist: user.wishlist });
});
