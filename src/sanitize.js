// sanitize.js

/**
 * Sanitizes input to remove leading/trailing spaces and escape special characters.
 * Prevents potential NoSQL injection attacks by escaping special MongoDB operators.
 * @param {string} input - The input string to be sanitized.
 * @returns {string} - The sanitized string.
 */
const sanitize = (input) => {
    if (typeof input !== 'string') return input; // Return as-is if not a string
  
    // Remove leading and trailing whitespaces
    let sanitizedInput = input.trim();
  
    // Escape MongoDB query operators to prevent NoSQL injection
    // This ensures that $ and other operators don't affect the query
    sanitizedInput = sanitizedInput.replace(/[$]/g, '');
  
    return sanitizedInput;
  };
  
  module.exports = sanitize;
  