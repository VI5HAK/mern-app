const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
};

const adminAuth = (req, res, next) => {
  auth(req, res, function () {
    if (!req.user) {
      // auth already sent a response
      return;
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  }).catch(err => {
    if (!res.headersSent) {
      res.status(401).json({ message: 'Authentication failed' });
    }
  });
};

module.exports = { auth, adminAuth }; 