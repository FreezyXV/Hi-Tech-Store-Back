// middlewares/validation.js
const Joi = require("joi");

// Import existing schemas
const {
  categorySchema,
  brandSchema,
  modelSchema,
  variantSchema,
} = require("../models/validationSchemas");

// Authentication Schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  username: Joi.string().min(3).max(30).required().messages({
    "string.min": "Username must be at least 3 characters long",
    "string.empty": "Username is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// General validation middleware factory
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    // Extract all error messages
    const messages = error.details.map((detail) => detail.message).join(", ");
    return res.status(400).json({ message: messages });
  }
  next();
};

// Export validation functions
exports.validateCategory = validate(categorySchema);
exports.validateBrand = validate(brandSchema);
exports.validateModel = validate(modelSchema);
exports.validateVariant = validate(variantSchema);

// New exports for authentication
exports.validateRegister = validate(registerSchema);
exports.validateLogin = validate(loginSchema);
