const Joi = require("joi");

// Variant Schema Validation
const variantSchema = Joi.object({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  imageUrls: Joi.string().uri().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  color: Joi.string().optional(),
  size: Joi.string().optional(),
  modem: Joi.string().optional(),
  bracelet: Joi.string().optional(),
  braceletColor: Joi.string().optional(),
  ram: Joi.string().optional(),
  chip: Joi.string().optional(),
  storage: Joi.string().optional(),
  modelId: Joi.string().required(),
});

// Model Schema Validation
const modelSchema = Joi.object({
  name: Joi.string().required(),
  imageUrls: Joi.string().uri().required(),
  release_date: Joi.date().required(),
  features: Joi.array().items(Joi.string()).optional(),
  specifications: Joi.object({
    cpu: Joi.string().optional(),
    gpu: Joi.string().optional(),
    ram: Joi.string().optional(),
    storage_type: Joi.string().optional(),
    weight: Joi.string().optional(),
    frequency_response: Joi.string().optional(),
    driver_size: Joi.string().optional(),
    impedance: Joi.string().optional(),
    charging_time: Joi.string().optional(),
    microphone: Joi.string().optional(),
    connectivity: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  screen: Joi.object({
    size: Joi.string().optional(),
    technology: Joi.string().optional(),
    resolution: Joi.string().optional(),
    refresh_rate: Joi.string().optional(),
    brightness: Joi.string().optional(),
    color_gamut: Joi.string().optional(),
    hdr: Joi.string().optional(),
    dolby_vision: Joi.boolean().optional(),
    contrast_ratio: Joi.string().optional(),
  }).optional(),
  battery: Joi.object({
    autonomy: Joi.string().optional(),
    capacity: Joi.string().optional(),
    charging: Joi.string().optional(),
    technology: Joi.string().optional(),
  }).optional(),
  connectivity: Joi.object({
    wifi: Joi.string().optional(),
    bluetooth: Joi.string().optional(),
    cellular: Joi.string().optional(),
    nfc: Joi.boolean().optional(),
    usb_ports: Joi.string().optional(),
    thunderbolt_ports: Joi.string().optional(),
    ethernet: Joi.boolean().optional(),
    hdmi_ports: Joi.number().optional(),
    headphone_jack: Joi.boolean().optional(),
  }).optional(),
  variants: Joi.array().items(variantSchema).min(1).required(),
});

// Brand Schema Validation
const brandSchema = Joi.object({
  name: Joi.string().required(),
  models: Joi.array().items(modelSchema).min(1).required(),
});

// Category Schema Validation
const categorySchema = Joi.object({
  name: Joi.string().required(),
  brands: Joi.array().items(brandSchema).min(1).required(),
});

module.exports = {
  variantSchema,
  modelSchema,
  brandSchema,
  categorySchema,
};
