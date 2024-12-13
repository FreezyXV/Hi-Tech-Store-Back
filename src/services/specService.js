const mongoose = require("mongoose");
const Category = require("../models/category"); // Adjust path as necessary

async function getVariantSpecs(
  categoryName,
  brandName,
  modelName,
  variantDetails
) {
  try {
    const category = await Category.findOne({ name: categoryName }).populate({
      path: "brands",
      match: { name: brandName },
      populate: {
        path: "models",
        match: { name: modelName },
      },
    });

    if (
      !category ||
      !category.brands.length ||
      !category.brands[0].models.length
    ) {
      return null;
    }

    const model = category.brands[0].models[0];
    const variant = model.variants.find(
      (v) =>
        v.color === variantDetails.color && v.storage === variantDetails.storage
    );

    if (variant) {
      return {
        variant,
        screen: model.screen,
        camera: model.camera,
        battery: model.battery,
        audio: model.audio,
        connectivity: model.connectivity,
        dimensions: model.dimensions,
        specifications: model.specifications,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching variant specs:", error);
    return null;
  }
}

module.exports = {
  getVariantSpecs,
};
