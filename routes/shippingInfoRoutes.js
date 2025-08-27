const express = require('express');
const { createShippingInfo, updateShippingInfo, getShippingInfo, deleteShippingInfo } = require('../controllers/shippingInfoController');

const router = express.Router();

router.post('/shipping-info' , createShippingInfo)
router.put('/shipping-info/:id' , updateShippingInfo)
router.get('/shipping-info' , getShippingInfo)
router.delete('/shipping-info/:id' , deleteShippingInfo)


module.exports = router;