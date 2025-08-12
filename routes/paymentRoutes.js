// const express = require('express');
// const router = express.Router();
// const paymentController = require('../controllers/paymentController');

// // Create Razorpay Order
// router.post('/checkout', paymentController.createRazorpayOrder);

// // Verify Payment & Place Order
// router.post('/verify', paymentController.verifyRazorpayPayment);

// module.exports = router;

const express = require('express');
const router = express.Router();
const paymentccController = require('../controllers/paymentccController');
const authCustomer = require('../middleware/authMiddleware').authCustomer;

// Initiate CC Avenue payment
router.post('/ccavenue/initiate', authCustomer, paymentccController.initiateCCAvenuePayment);

// CC Avenue callback handler
router.post('/ccavenue/callback', paymentccController.handleCCAvenueCallback);

module.exports = router;