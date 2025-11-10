// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.error("Authorization error: No token provided.");
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Expose the user identifier with consistent naming for downstream handlers
    req.user = {
      ...decoded,
      _id: decoded.userId,
      userId: decoded.userId,
    };
    req.userId = decoded.userId;

    console.log("User authenticated:", decoded.userId);
    next();
  } catch (err) {
    console.error("Authorization error: Invalid or expired token.");
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = authMiddleware;


