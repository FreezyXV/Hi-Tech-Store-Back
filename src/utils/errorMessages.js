// utils/errorMessages.js

/**
 * Centralized error messages for consistency across the application
 */
module.exports = {
  // Generic CRUD errors
  notFound: (entity) => `${entity} not found`,
  alreadyExists: (entity) => `${entity} already exists`,
  invalidData: (field) => `Invalid ${field} provided`,
  required: (field) => `${field} is required`,

  // Authentication errors
  auth: {
    noToken: 'Unauthorized: No token provided',
    invalidToken: 'Unauthorized: Invalid or expired token',
    invalidCredentials: 'Invalid email or password',
    emailExists: 'Email already exists',
    usernameExists: 'Username already exists',
    emailOrUsernameExists: 'Email or Username already exists',
    incorrectPassword: 'Current password is incorrect',
    passwordChanged: 'Password changed successfully',
    userRegistered: 'User registered successfully',
    profileUpdated: 'Profile updated successfully'
  },

  // Cart errors
  cart: {
    empty: 'Cart is empty',
    insufficientStock: 'Insufficient stock available',
    invalidQuantity: 'Invalid quantity provided',
    invalidVariantId: 'Invalid variantId or quantity',
    itemAdded: 'Item added to cart successfully',
    itemRemoved: 'Item removed from cart',
    cartCleared: 'Cart cleared successfully',
    cartUpdated: 'Cart updated successfully'
  },

  // Order errors
  order: {
    invalidDeliveryMethod: 'Invalid delivery method',
    totalMismatch: 'Total amount mismatch',
    missingFields: 'All required fields must be provided',
    paymentFailed: 'Failed to create payment intent',
    invalidItems: 'Order items are required',
    invalidTotalAmount: 'Total amount must be a positive number',
    invalidVariants: 'Invalid or missing variants in order items',
    missingAddressFields: (fields) => `Missing required address fields: ${fields.join(', ')}`
  },

  // Wishlist messages
  wishlist: {
    added: 'Item added to wishlist',
    removed: 'Item removed from wishlist',
    alreadyExists: 'Item already in wishlist'
  },

  // Review messages
  review: {
    added: 'Review added successfully',
    deleted: 'Review deleted successfully',
    fetchFailed: 'Failed to fetch reviews'
  },

  // Server errors
  server: {
    error: 'Something went wrong!',
    dbError: 'Database operation failed'
  }
};
