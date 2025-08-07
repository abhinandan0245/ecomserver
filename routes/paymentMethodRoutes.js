const express = require('express');
const { createPaymentMethod, getAllPaymentMethods, updatePaymentMethod, togglePaymentMethodStatus, deletePaymentMethod } = require('../controllers/paymentMethodController');
const router = express.Router();


router.post('/payment-method', createPaymentMethod);
router.get('/payment-method', getAllPaymentMethods);
router.put('/payment-method/:id', updatePaymentMethod);
router.patch('/payment-method/:id/toggle', togglePaymentMethodStatus);
router.delete('/payment-method/:id', deletePaymentMethod);

module.exports = router;
