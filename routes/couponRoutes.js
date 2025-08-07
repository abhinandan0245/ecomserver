// const express = require('express');
// const router = express.Router();
// const couponController = require('../controllers/couponController');

// const {
//   createCoupon,
//   getAllCoupons,
//   updateCoupon,
//   deleteCoupon,
//   getCouponById,
//   getCouponsByCode,
//   getCouponsByDiscountType,
//   getCouponsByAmount,
//   getCouponsByExpiryDate,
//   searchCoupons,
//   getCouponsByDateRange,
//   getCouponsByActiveStatus
// } = require('../controllers/couponController');



// Create a new coupon
// router.post('/coupon', couponController.createCoupon); // Create a new coupon    
// // Get all coupons
// router.get('/coupons', couponController.getAllCoupons); // Get all coupons
// // Update a coupon by ID
// router.put('/coupon/:id', couponController.updateCoupon); // Update a coupon by ID
// // Delete a coupon by ID
// router.delete('/coupon/:id', couponController.deleteCoupon); // Delete a coupon by ID
// // Get a coupon by ID
// router.get('/coupon/:id', couponController.getCouponById); // Get a coupon by ID
// // Get coupons by code
// // router.get('/coupons/code/:code', getCouponsByCode); // Get coupons by code
// // Get coupons by discount type
// router.get('/coupons/discount-type/:discountType', couponController.getCouponsByDiscountType); // Get coupons by discount type   
// // Get coupons by amount
// // router.get('/coupons/amount/:amount', getCouponsByAmount); // Get coupons by amount
// // Get coupons by expiry date
// // router.get('/coupons/expiry-date/:expiryDate', getCouponsByExpiryDate); // Get coupons by expiry date
// // Search coupons by various criteria
// router.get('/coupons/search', couponController.searchCoupons); // Search coupons by various criteria
// //get coupon by type
// // router.get('/coupons/type/:type', getCouponsByDiscountType); // Get coupons by discount type
// // get coupon by status 
// router.get('/coupons/status/:status', couponController.getCouponsByActiveStatus); // Get coupons by status

// // get coupon by daterange 

// // Get by date range
// router.get('/coupons/date-range' , couponController.getCouponsByDateRange); // Get coupons by date range
// // Get coupons by date range


// module.exports = router;
// This router handles all coupon-related routes, including creating, retrieving, updating, and deleting coupons.


const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Create a new coupon
router.post('/coupon', couponController.createCoupon);

// Get all coupons
router.get('/coupons', couponController.getAllCoupons);

// Get a coupon by ID
router.get('/coupon/:id', couponController.getCouponById);

// Update a coupon by ID
router.put('/coupon/:id', couponController.updateCoupon);
router.put('/coupon/:id/status', couponController.toggleCouponStatus);

// Delete a coupon by ID
router.delete('/coupon/:id', couponController.deleteCoupon);

// Apply a coupon (e.g. check and mark used)
router.post('/coupon/apply', couponController.applyCoupon);

// Search coupons by query parameters (code, discountType, minDiscount, maxDiscount)
router.get('/coupons/search', couponController.searchCoupons);

// Get active coupons (valid currently)
router.get('/coupons/active', couponController.getActiveCoupons);

module.exports = router;
