// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Add to wishlist
router.post('/add', wishlistController.addToWishlist);

// Get paginated wishlist for customer
router.get('/customer/:customerId', wishlistController.viewWishlist);

// Check if product is in wishlist
router.get('/check', wishlistController.checkWishlist);

// Remove from wishlist
router.delete('/:id', wishlistController.deleteFromWishlist);

module.exports = router;
