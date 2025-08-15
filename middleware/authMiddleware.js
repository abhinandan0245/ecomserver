// const jwt = require('jsonwebtoken');
// const db = require('../models');
// const User = db.User || db.user; // Handles both 'User' and 'user'

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.header('Authorization');
//     const token = authHeader?.split(' ')[1]; // Bearer <token>

//     if (!token) {
//       return res.status(401).json({ msg: 'No token, authorization denied' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findByPk(decoded.id);
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     req.userId = user.id;
//     req.userRole = user.role;
//     req.user = user;

//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Invalid or expired token', error: err.message });
//   }
// };

// module.exports = authMiddleware;


// middlewares/auth.js
const jwt = require('jsonwebtoken');

// Use process.env.JWT_SECRET directly (no destructuring needed)
const SECRET_KEY = process.env.JWT_SECRET;

// 🔍 Extract token from Authorization header
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

// ✅ Auth Middleware for Customer
exports.authCustomer = (req, res, next) => {

  // console.log('Auth Middleware for Customer', req.headers);
  const token = extractToken(req);
  // console.log('Customer token:', token);

  

  if (!token) return res.status(401).json({ message: 'No token provided from frontend' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied: Customers only' });
    }
    

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Auth Middleware for Admin
exports.authAdmin = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};


