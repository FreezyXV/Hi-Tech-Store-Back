//models/category.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Screen Schema
const screenSchema = new Schema(
  {
    size: { type: String },
    technology: { type: String },
    resolution: { type: String },
    refreshRate: { type: String },
    brightness: { type: String },
    colorGamut: { type: String },
    hdr: { type: String },
    dolbyVision: { type: Boolean },
    contrastRatio: { type: String },
  },
  { _id: false }
);

// Battery Schema
const batterySchema = new Schema(
  {
    autonomy: { type: String },
    capacity: { type: String },
    charging: { type: String },
    technology: { type: String },
  },
  { _id: false }
);

// Connectivity Schema
const connectivitySchema = new Schema(
  {
    wifi: { type: String },
    bluetooth: { type: String },
    cellular: { type: String },
    nfc: { type: Boolean },
    usbPorts: { type: String },
    thunderboltPorts: { type: String },
    ethernet: { type: Boolean },
    hdmiPorts: { type: Number },
    headphoneJack: { type: Boolean },
  },
  { _id: false }
);

// Specifications Schema
const specificationSchema = new Schema(
  {
    cpu: { type: String },
    gpu: { type: String },
    ram: { type: String },
    storageType: { type: String },
    expandableStorage: { type: String },
    dimensions: { type: String },
    weight: { type: String },
    connectivity: [String],
  },
  { _id: false }
);

// Variant Schema
const variantSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true, required: true },
    imageUrls: {
      type: [String],
      required: true,
      default: [], // Provide a default empty array
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 10 },
    color: { type: String },
    size: { type: String },
    modem: { type: String },
    bracelet: { type: String },
    braceletColor: { type: String },
    ram: { type: String },
    chip: { type: String },
    storage: { type: String },
    modelId: { type: Schema.Types.ObjectId, ref: "Model", required: true },
  },
  { timestamps: true }
);

// Ensure unique variants per model
variantSchema.index({ modelId: 1, sku: 1 }, { unique: true });

// Model Schema
const modelSchema = new Schema(
  {
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    brandName: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryName: { type: String, required: true },
    name: { type: String, required: true },
    imageUrls: { type: String, required: true },
    features: [String],
    specifications: specificationSchema,
    screen: screenSchema,
    battery: batterySchema,
    connectivity: connectivitySchema,
    releaseDate: { type: Date },
    variants: [{ type: Schema.Types.ObjectId, ref: "Variant" }],
  },
  { timestamps: true }
);

// Brand Schema
const brandSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true },
    models: [{ type: Schema.Types.ObjectId, ref: "Model" }],
  },
  { timestamps: true }
);

// Category Schema
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    imageUrls: { type: String },
    description: { type: String },
    brands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
  },
  { timestamps: true }
);

// Ensure indexes for optimization
categorySchema.index({ name: 1 }, { unique: true });
brandSchema.index({ name: 1, categoryId: 1 }, { unique: true });
modelSchema.index({ name: 1, brandId: 1, categoryId: 1 }, { unique: true });

// Models
const Category = mongoose.model("Category", categorySchema);
const Brand = mongoose.model("Brand", brandSchema);
const Model = mongoose.model("Model", modelSchema);
const Variant = mongoose.model("Variant", variantSchema);

module.exports = { Category, Brand, Model, Variant };
