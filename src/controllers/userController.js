// controllers/userController.js
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');
const { findUserWithSelect } = require('../utils/userHelpers');
const errorMessages = require('../utils/errorMessages');
const bcrypt = require('bcryptjs');

// Get User by ID
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await findUserWithSelect(req.params.id, '-password');
  res.status(200).json({ success: true, data: user });
});

// Get All Users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({ success: true, data: users });
});

// Update User
exports.updateUser = [
  check('username').notEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError(errorMessages.notFound('User'), 404);
    }

    user.username = username;
    user.email = email;
    user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json({ success: true, data: user });
  })
];

// Delete User
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError(errorMessages.notFound('User'), 404);
  }

  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User removed' });
});



