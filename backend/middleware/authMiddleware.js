// ================================================================
// Shreedha Vastra — Auth Middleware
// ================================================================
// `protect`   — verifies the JWT and attaches the logged-in user
//               to req.user. Blocks the request if missing/invalid.
// `authorize` — restricts a route to specific roles (e.g. admin).
//               Must be used AFTER `protect`.
// ================================================================

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Token can arrive via httpOnly cookie (web app) or Authorization header (future mobile/API clients)
  if (req.cookies?.[process.env.JWT_COOKIE_NAME || 'shreedha_token']) {
    token = req.cookies[process.env.JWT_COOKIE_NAME || 'shreedha_token'];
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized. Please log in to continue.');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('The user belonging to this session no longer exists.');
  }

  req.user = user;
  next();
});

// Usage: authorize('admin') — only admins may proceed
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You do not have permission to perform this action.');
    }
    next();
  };
};

export { protect, authorize };
