const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  console.log("🧪 validate.js middleware reached"); // <-- Add this log

  const errors = validationResult(req);
  console.log("🧪 Validation errors:", errors.array()); // <-- Add this log

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: 'Validation failed',
      errors: errors.array()
    });
  }

  next();
};
