const express = require("express");
const {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  addToUserWishlist,
  removeFromUserWishlist,
} = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:id", auth, getUserById);
router.get("/", auth, getAllUsers);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

// Add to wishlist
router.post("/wishlist", auth, addToUserWishlist);

// Remove from wishlist
router.delete("/wishlist/:variantId", auth, removeFromUserWishlist);

module.exports = router;
