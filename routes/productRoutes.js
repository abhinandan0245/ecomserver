const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, getAllProducts, filterProducts, getProductById, deleteProduct } = require('../controllers/productController');
const upload = require('../middleware/upload');
const { createBrand, getAllBrands, updateBrand, deleteBrand, getBrandsByCategory } = require('../controllers/brandController');
const { createInventory, updateInventory, getAllInventory, getInventoryById, deleteInventory } = require('../controllers/inventoryController');
const { createReview, updateReviewStatus, getAllReviews, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Use dynamic colors (maxCount = high)
router.post(
  '/product',
  // upload.any(), 
   upload.array('images'),
  createProduct
);

router.put(
  '/product/:id',
  // upload.any(), 
   upload.array('images'),
  updateProduct
);

router.get('/products',   getAllProducts);
router.get('/product/filter',  filterProducts);
router.get('/product/:id', getProductById);
router.delete('/product/:id',  deleteProduct);

// brand 

// router.post('/brand', upload.array('logo', 5), createBrand);
router.post('/brand', createBrand);
router.get('/brands', getAllBrands);
router.get('/brandsby/category', getBrandsByCategory);
router.put('/brand/:id', updateBrand);
router.delete('/brand/:id', deleteBrand);


// inventory 


router.post('/inventory', createInventory);
router.put('/inventory/:id', updateInventory);
router.get('/inventory', getAllInventory);
router.get('/inventory/:id', getInventoryById);
router.delete('/inventory/:id', deleteInventory);


// review 

router.post('/review' , createReview)
router.get('/reviews' , getAllReviews)
router.put('/reviews/:id/status' , updateReviewStatus)
router.delete('/review:id' , deleteReview)



module.exports = router;
