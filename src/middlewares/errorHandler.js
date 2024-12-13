// middlewares/errorHandler.js
const AppError = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('ERROR 💥:', err);

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

module.exports = errorHandler;
