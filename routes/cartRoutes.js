// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartQuantity);
router.get('/view/:customerId', cartController.viewCart);
router.delete('/remove', cartController.removeFromCart);

module.exports = router;