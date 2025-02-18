// routes/modelRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel,
} = require("../controllers/modelController");
const { validateModel } = require("../middlewares/validation");
const asyncHandler = require("../middlewares/asyncHandler");

// Routes pour gérer les modèles
router.get("/", asyncHandler(getModels));
router.get("/:modelId", asyncHandler(getModelById));
router.post("/", validateModel, asyncHandler(createModel));
router.put("/:modelId", validateModel, asyncHandler(updateModel));
router.delete("/:modelId", asyncHandler(deleteModel));

module.exports = router;
