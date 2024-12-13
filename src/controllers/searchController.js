// searchController.js
const { Category, Brand, Model } = require("../models/category");

exports.searchModels = async (req, res, next) => {
  const query = req.query.q;
  if (!query)
    return res.status(400).json({ message: "No search query provided" });

  try {
    const matchedCategories = await Category.find({
      name: { $regex: query, $options: "i" },
    });

    console.log(`Categories found: ${matchedCategories.length}`);

    const categoryIds = matchedCategories.map((category) => category._id);
    const brandsInMatchedCategories = await Brand.find({
      categoryId: { $in: categoryIds },
    });

    console.log(
      `Brands in matched categories: ${brandsInMatchedCategories.length}`
    );

    const models = await Model.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        {
          brandId: { $in: brandsInMatchedCategories.map((brand) => brand._id) },
        },
        {
          brandId: {
            $in: (
              await Brand.find({ name: { $regex: query, $options: "i" } })
            ).map((brand) => brand._id),
          },
        },
      ],
    })
      .populate("brandId")
      .populate("variants");

    console.log(`Models found: ${models.length}`);

    const results = models.map((model) => ({
      _id: model._id,
      name: model.name,
      brand: model.brandId.name,
      category: model.brandId.categoryId.name,
      imageUrls: model.imageUrls,
      variants: model.variants,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error("Error in searchModels:", error);
    next(error);
  }
};
