//models/Review.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    modelId: {
      type: Schema.Types.ObjectId,
      ref: "Model",
      required: false,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ modelId: 1, variantId: 1 });

module.exports = mongoose.model("Review", reviewSchema);
