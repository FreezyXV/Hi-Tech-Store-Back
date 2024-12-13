const Cart = require("../models/cart");
const Order = require("../models/order");
const mongoose = require("mongoose");

const createOrderFromCart = async (userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.variant",
      "price name"
    );
    if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );

    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        variant: item.variant._id,
        quantity: item.quantity,
      })),
      totalAmount,
    });

    await order.save({ session });
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw new Error("Transaction failed: " + error.message);
  } finally {
    session.endSession();
  }
};

module.exports = {
  createOrderFromCart,
};
