// ================================================================
// Shreedha Vastra — JWT Token Generator
// ================================================================
// Signs a JWT for a given user ID and sets it as a secure,
// httpOnly cookie on the response. httpOnly means JavaScript in
// the browser can never read this cookie, which protects the
// token from XSS-based theft.
// ================================================================

import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const cookieName = process.env.JWT_COOKIE_NAME || 'shreedha_token';

  res.cookie(cookieName, token, {
    httpOnly: true, // inaccessible to client-side JS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // allows cross-site cookie in prod (different domains)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, in ms
  });

  return token;
};

export default generateToken;
