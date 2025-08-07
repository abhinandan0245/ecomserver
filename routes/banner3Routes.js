const express = require('express');
const router = express.Router();
const setUploadFolder = require('../middleware/setUploadFolder');
const upload = require('../middleware/upload');
const { createBanner3, getAllBanners3, getBannerById3, updateBanner3, deleteBanner3 } = require('../controllers/bannerController3');


// Multer expects an array of named fields
// const bannerImageFields = upload.fields([
//   { name: 'homepageImage', maxCount: 1 },
//   { name: 'homepageImage2', maxCount: 1 }
// ]);

// create banner 
router.post(
  '/bannerthree',
  setUploadFolder('uploads/bannerImage'), // 1. Sets dynamic folder
  // upload.any('image'),                 // 2. Accepts one image with field name 'image'
  upload.fields([
  { name: 'homepageImage', maxCount: 1 },
  { name: 'homepageImage2', maxCount: 1 }
]),
  createBanner3                  // 3. Handles saving to DB
);

// get all banners
router.get('/bannersthree', getAllBanners3);

// get banner by id
router.get('/bannerthree/:id' , getBannerById3);

// update banner 

router.put(
  '/bannerthree/:id',
  setUploadFolder('uploads/bannerImage'), // 1. Sets dynamic folder
  // upload.any('image'),                 // 2. Accepts one image with field name 'image'
 upload.fields([
  { name: 'homepageImage', maxCount: 1 },
  { name: 'homepageImage2', maxCount: 1 }
]),
  updateBanner3                        // 3. Handles saving to DB
);

// delete banner by id

router.delete('/bannerthree/:id' , deleteBanner3)








module.exports = router;
// This code sets up a route for creating banners. It uses middleware to set the upload folder dynamically, handles file uploads with multer, and processes the request to create a banner in the database. The banner image is stored in a specified folder, and the banner details are saved in the database using the `createBanner` controller function.
