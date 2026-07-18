// ================================================================
// Shreedha Vastra — Validation Middleware
// ================================================================
// Runs after an array of express-validator rules (defined in each
// route file) and short-circuits with a clean 400 error if any
// rule failed, before the request ever reaches the controller.
// ================================================================

import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
    return;
  }

  next();
};

export default validate;
