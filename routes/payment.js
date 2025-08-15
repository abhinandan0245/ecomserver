// routes/payment.js
const express = require('express');
const router = express.Router();
const paymentCb = require('../controllers/paymentCallbackController');
const bodyParser = require('body-parser');

// CCAvenue posts x-www-form-urlencoded
router.post('/ccavenue/callback', bodyParser.urlencoded({ extended: false }), paymentCb.ccavenueCallback);

module.exports = router;
