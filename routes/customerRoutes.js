const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');
const { authCustomer, authAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', customerController.registerCustomer);
router.post('/login', customerController.loginCustomer);

// Customer-only routes
router.get('/profile', authCustomer, customerController.getProfile);
router.put('/profile', authCustomer, customerController.updateProfile);
router.put('/upload-image', authCustomer, upload.single('profileImage'), customerController.uploadProfileImage);
router.delete('/profile', authCustomer, customerController.deleteProfile);

// Admin-only routes
router.get('/', authAdmin, customerController.getAllCustomers);
router.get('/:id', authAdmin, customerController.getCustomerById);
// Admin-only delete route
router.delete('/:id', authAdmin, customerController.deleteCustomerByAdmin);


module.exports = router;
