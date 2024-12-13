const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for individual cart items
const cartItemSchema = new Schema({
  variant: {
    type: Schema.Types.ObjectId,
    ref: "Variant",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: [1, "Quantity must be at least 1"],
  },
});

// Schema for the cart
const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update the `updatedAt` field before saving
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for optimized queries based on the user
cartSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
