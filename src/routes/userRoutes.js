const express = require('express');
const {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:id', auth, getUserById);
router.get('/', auth, getAllUsers);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

// NOTE: Wishlist routes have been moved to authRoutes.js for better semantic organization
// Wishlist operations are user-specific and handled through /api/auth/wishlist endpoints

module.exports = router;
