
//userController.js 
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const { Variant } = require('../models/category');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update User
exports.updateUser = [
  check('username').notEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.username = username;
      user.email = email;
      user.password = await bcrypt.hash(password, 10);

      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
];

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove();
    res.status(200).json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



