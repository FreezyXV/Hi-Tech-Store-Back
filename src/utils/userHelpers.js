// utils/userHelpers.js
const User = require('../models/user');
const AppError = require('./appError');

/**
 * Find user by ID or throw 404 error
 * @param {string} userId - User ID to find
 * @returns {Promise<User>} User document
 * @throws {AppError} 404 if user not found
 */
exports.findUserOrFail = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Find user with selected fields or throw 404
 * @param {string} userId - User ID to find
 * @param {string} selectFields - Fields to select (default: '-password')
 * @returns {Promise<User>} User document with selected fields
 * @throws {AppError} 404 if user not found
 */
exports.findUserWithSelect = async (userId, selectFields = '-password') => {
  const user = await User.findById(userId).select(selectFields);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Find user with population or throw 404
 * @param {string} userId - User ID to find
 * @param {Object|string} populateConfig - Mongoose populate configuration
 * @returns {Promise<User>} User document with populated fields
 * @throws {AppError} 404 if user not found
 */
exports.findUserWithPopulate = async (userId, populateConfig) => {
  const user = await User.findById(userId)
    .select('-password')
    .populate(populateConfig);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};
