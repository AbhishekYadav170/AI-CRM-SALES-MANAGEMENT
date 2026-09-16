// Usage: authorize('admin', 'superadmin') — sirf yeh roles is route ko access kar sakte hain
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }
    next();
  };
};

module.exports = { authorize };
