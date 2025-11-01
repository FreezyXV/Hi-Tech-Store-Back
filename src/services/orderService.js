// services/orderService.js
const { Variant } = require('../models/category');
const AppError = require('../utils/appError');
const errorMessages = require('../utils/errorMessages');

class OrderService {
  static DELIVERY_COSTS = {
    standard: 5,
    express: 15
  };

  /**
   * Get delivery cost for a method
   * @param {string} deliveryMethod - 'standard' or 'express'
   * @returns {number} Delivery cost
   * @throws {AppError} 400 if method invalid
   */
  static getDeliveryCost(deliveryMethod) {
    const cost = this.DELIVERY_COSTS[deliveryMethod.toLowerCase()];
    if (cost === undefined) {
      throw new AppError(errorMessages.order.invalidDeliveryMethod, 400);
    }
    return cost;
  }

  /**
   * Validate items and calculate order total
   * @param {Array} items - Order items with variant IDs and quantities
   * @param {string} deliveryMethod - Delivery method
   * @param {string} variantIdKey - Key name for variant ID ('variant' or 'id')
   * @returns {Object} { baseTotalAmount, deliveryCost, totalAmount, variants }
   */
  static async validateAndCalculateTotal(items, deliveryMethod, variantIdKey = 'variant') {
    // Extract variant IDs
    const variantIds = items.map(item => item[variantIdKey]);

    // Fetch all variants
    const variants = await Variant.find({ _id: { $in: variantIds } });

    // Validate all variants exist
    if (variants.length !== items.length) {
      throw new AppError(errorMessages.order.invalidVariants, 400);
    }

    // Calculate base total
    const baseTotalAmount = items.reduce((sum, item) => {
      const variantId = item[variantIdKey];
      const variant = variants.find(v => v._id.toString() === variantId);

      if (!variant) {
        throw new AppError(`Variant with ID ${variantId} not found`, 400);
      }

      return sum + variant.price * item.quantity;
    }, 0);

    // Get delivery cost
    const deliveryCost = this.getDeliveryCost(deliveryMethod);

    return {
      baseTotalAmount,
      deliveryCost,
      totalAmount: baseTotalAmount + deliveryCost,
      variants
    };
  }

  /**
   * Validate shipping address
   * @param {Object} shippingAddress - Shipping address object
   * @throws {AppError} 400 if invalid
   */
  static validateShippingAddress(shippingAddress) {
    const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);

    if (missingFields.length > 0) {
      throw new AppError(
        errorMessages.order.missingAddressFields(missingFields),
        400
      );
    }
  }

  /**
   * Validate delivery method
   * @param {string} deliveryMethod - Delivery method to validate
   * @throws {AppError} 400 if invalid
   */
  static validateDeliveryMethod(deliveryMethod) {
    if (!deliveryMethod || !['standard', 'express'].includes(deliveryMethod.toLowerCase())) {
      throw new AppError("Delivery method must be either 'standard' or 'express'", 400);
    }
  }
}

module.exports = OrderService;
