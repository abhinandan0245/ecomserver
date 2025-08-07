const { body } = require('express-validator');
// console.log("Signup validator loaded"); // At the top of the file


exports.signupValidator = [
    
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role')
];
// console.log("🧪 signupValidator loaded"); // <-- Add this line


exports.loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];
