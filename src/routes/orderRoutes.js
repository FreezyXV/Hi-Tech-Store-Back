//orderRoutes.js
const express = require("express");
const {
  createOrderFromCart,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  createOrder,

  fetchPaymentIntent,
} = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

router.post("/", createOrder);

router.post("/cart", createOrderFromCart);
router.post("/create-payment-intent", fetchPaymentIntent);
router.get("/:id", getOrderById);
router.get("/user/:userId", getOrdersByUserId);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
