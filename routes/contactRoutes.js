const express = require('express');
const { saveContactPage, getContactPage } = require('../controllers/contactPageController');        
const router = express.Router();
// Create or Update Contact Page
router.post('/contact', saveContactPage);
// Get Contact Page 
router.get('/contact', getContactPage);

module.exports = router;