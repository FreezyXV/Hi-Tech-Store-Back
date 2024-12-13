const Cart = require("../models/cart");
const { Variant } = require("../models/category");

class CartService {
  static async getUserCart(userId) {
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.variant",
      "name price imageUrls"
    );
    return cart || { items: [] };
  }

  static async addItemToCart(userId, variantId, quantity) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const variant = await Variant.findById(variantId).select(
      "name price imageUrls stock"
    );
    if (!variant) throw new Error("Variant not found");

    const existingItem = cart.items.find(
      (item) => item.variant.toString() === variantId
    );

    if (existingItem) {
      if (existingItem.quantity + quantity > variant.stock) {
        throw new Error("Insufficient stock available");
      }
      existingItem.quantity += quantity;
    } else {
      if (quantity > variant.stock) {
        throw new Error("Insufficient stock available");
      }
      cart.items.push({ variant: variantId, quantity });
    }

    await cart.save();
    return await Cart.findOne({ user: userId }).populate(
      "items.variant",
      "name price imageUrls"
    );
  }

  static async clearUserCart(userId) {
    await Cart.updateOne({ user: userId }, { $set: { items: [] } });
    return this.getUserCart(userId);
  }
}

module.exports = CartService;
