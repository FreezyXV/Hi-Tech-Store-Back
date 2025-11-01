// utils/responseFormatter.js

/**
 * Send standardized success response
 * @param {Response} res - Express response object
 * @param {*} data - Response data
 * @param {string|null} message - Optional message
 * @param {number} statusCode - HTTP status code (default 200)
 * @returns {Response} Express response
 */
exports.success = (res, data = null, message = null, statusCode = 200) => {
  const response = { success: true };

  if (message) {
    response.message = message;
  }

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send standardized error response
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 400)
 * @returns {Response} Express response
 */
exports.error = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

/**
 * Send paginated response
 * @param {Response} res - Express response object
 * @param {Array} data - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @returns {Response} Express response
 */
exports.paginated = (res, data, page, limit, total) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};
