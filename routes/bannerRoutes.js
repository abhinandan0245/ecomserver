const express = require('express');
const router = express.Router();
const setUploadFolder = require('../middleware/setUploadFolder');
const { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner } = require('../controllers/bannerController');
const upload = require('../middleware/upload');

// create banner 
router.post(
  '/banner',
  setUploadFolder('uploads/bannerImage'), // 1. Sets dynamic folder
  upload.single('image'),                 // 2. Accepts one image with field name 'image'
  createBanner                            // 3. Handles saving to DB
);


// get all banners
router.get('/banners', getAllBanners);

// get banner by id
router.get('/banner/:id' , getBannerById);

// update banner 

router.put(
  '/banner/:id',
  setUploadFolder('uploads/bannerImage'), // 1. Sets dynamic folder
  upload.single('image'),                 // 2. Accepts one image with field name 'image'
  updateBanner                         // 3. Handles saving to DB
);

// delete banner by id

router.delete('/banner/:id' , deleteBanner)








module.exports = router;
// This code sets up a route for creating banners. It uses middleware to set the upload folder dynamically, handles file uploads with multer, and processes the request to create a banner in the database. The banner image is stored in a specified folder, and the banner details are saved in the database using the `createBanner` controller function.
