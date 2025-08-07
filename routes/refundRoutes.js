const express = require('express');
const router = express.Router();
const { createRefund, getAllRefunds, updateRefund, deleteRefund, getRefundById } = require('../controllers/refundController');

 
router.post('/refund', createRefund)
router.get('/refunds', getAllRefunds)
router.get('/refunds/:id', getRefundById)
router.put('/refund/:id', updateRefund)
router.delete('/refund/:id', deleteRefund)
    





module.exports = router;