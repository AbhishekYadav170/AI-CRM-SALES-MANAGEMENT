const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Route ko protect karta hai — valid JWT token zaroori hai
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ko DB se nikal ke request object mein daal do (password ke bina)
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: 'User not found or inactive' });
      }

      // companyId request mein daal do — har controller isse use karega
      req.companyId = decoded.companyId;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
