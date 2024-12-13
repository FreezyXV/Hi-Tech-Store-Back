// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../middlewares/validation');

// Public Routes
router.post('/register', validateRegister, authController.registerUser);
router.post('/login', validateLogin, authController.loginUser);

// Protected Routes
router.get('/me', authMiddleware, authController.getProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.put('/update', authMiddleware, authController.updateUser);

// Wishlist Routes
router.post('/wishlist', authMiddleware, authController.addToUserWishlist);
router.delete('/wishlist/:variantId', authMiddleware, authController.removeFromUserWishlist);
router.get('/wishlist', authMiddleware, authController.getUserWishlist);

module.exports = router;
