const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create Razorpay Order
router.post('/checkout', paymentController.createRazorpayOrder);

// Verify Payment & Place Order
router.post('/verify', paymentController.verifyRazorpayPayment);

module.exports = router;
