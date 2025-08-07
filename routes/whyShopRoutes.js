// routes/whyShopRoutes.js
const express = require('express');
const { createWhyShop, getAllWhyShop, getWhyShopById, updateWhyShop, deleteWhyShop } = require('../controllers/whyShopController');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', upload.none() , createWhyShop);
router.get('/', getAllWhyShop);
router.get('/:id', getWhyShopById);
router.put('/:id',upload.none() , updateWhyShop);
router.delete('/:id', deleteWhyShop);

module.exports = router;
