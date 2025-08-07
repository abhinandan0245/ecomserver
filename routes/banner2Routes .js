const express = require('express');
const router = express.Router();
const setUploadFolder = require('../middleware/setUploadFolder');
const upload = require('../middleware/upload');
const { createBanner2, getAllBanners2, getBannerById2, updateBanner2, deleteBanner2 } = require('../controllers/bannerController2');

// create banner 
router.post(
  '/bannertwo',
  setUploadFolder('uploads/bannerImage'), // 1. Sets dynamic folder
  upload.single('image'),                 // 2. Accepts one image with field name 'image'
  createBanner2                      // 3. Handles saving to DB
);

// get all banners
router.get('/bannerstwo', getAllBanners2);

// get banner by id
router.get('/bannertwo/:id' , getBannerById2);

// update banner 

router.put(
  '/bannertwo/:id',
  setUploadFolder('uploads/bannerImage'), // 1. Sets dynamic folder
  upload.single('image'),                 // 2. Accepts one image with field name 'image'
  updateBanner2                     // 3. Handles saving to DB
);

// delete banner by id

router.delete('/bannertwo/:id' , deleteBanner2)








module.exports = router;
// This code sets up a route for creating banners. It uses middleware to set the upload folder dynamically, handles file uploads with multer, and processes the request to create a banner in the database. The banner image is stored in a specified folder, and the banner details are saved in the database using the `createBanner` controller function.
