// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/add', wishlistController.addToWishlist);
router.get('/:customerId', wishlistController.viewWishlist);
router.delete('/:id', wishlistController.deleteFromWishlist);

module.exports = router;
