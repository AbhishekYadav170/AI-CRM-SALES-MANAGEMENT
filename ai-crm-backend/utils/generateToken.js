const jwt = require('jsonwebtoken');

// userId aur companyId dono token mein daalte hain — baad mein multi-tenant
// filtering ke liye har request mein companyId available rahega
const generateToken = (userId, companyId, role) => {
  return jwt.sign({ userId, companyId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
