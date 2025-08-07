// routes/brandRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/brandController');
const upload = require('../middleware/upload');

router.post('/brand', upload.array('logo', 5), controller.createBrand);
router.get('/brands', controller.getAllBrands);

module.exports = router;
