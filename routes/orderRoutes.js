const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {createOrder , getAllOrders , getOrderById ,  cancelOrder , exportOrders , getDropdownOptions , getDeliveredOrders , updateOrderStatus, createRazorpayOrder, getOrdersByStatus, handleCCAvenueCallback, handlePaymentSuccess, confirmPayment, getOrderWithShipments, getMyOrders, getMyOrderById} = require('../controllers/orderController')
const { authAdmin  , authCustomer } = require('../middleware/authMiddleware');

// Create Razorpay order (user)

// Create order (user)
router.post('/', authCustomer ,  createOrder);
// CC Avenue payment callback
router.post('/ccavenue/callback', handleCCAvenueCallback);

// Get order success details
router.get('/success/:orderId', handlePaymentSuccess);
// router.post('/confirm-payment', authCustomer, confirmPayment);

//  Get all orders (admin)
router.get('/', authAdmin, getAllOrders);

router.get('/my', authCustomer, getMyOrders);
router.get('/my/:id', authCustomer, getMyOrderById);

//  Get single order by ID (admin)
router.get('/:id', authAdmin, getOrderById);

//  Cancel order (admin)
router.patch('/:id/cancel', authAdmin, cancelOrder);

//  Export orders CSV (admin)
router.get('/export/csv', authAdmin, exportOrders);

//  Dropdown options (admin or user)
router.get('/dropdown/options', authAdmin, getDropdownOptions);

//  Delivered orders list (admin)
router.get('/delivered/list', authAdmin, getOrdersByStatus);

//  Update order status (admin)
router.put('/:id/status', authAdmin, updateOrderStatus);

router.get("/:id/shipments",getOrderWithShipments);

module.exports = router;
