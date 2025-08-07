const express = require('express');
const upload = require('../middleware/upload');
const setUploadFolder = require('../middleware/setUploadFolder');
const { createOrUpdateAboutUs, getAboutUs, getAllAboutUs, deleteAboutUs, toggleAboutUsStatus } = require('../controllers/aboutusController');
const router = express.Router();

router.post(
  '/aboutus',
  setUploadFolder('uploads/about'),
  upload.single('image'), // image is optional
  createOrUpdateAboutUs 
);

router.get('/aboutus/:id', getAboutUs);
router.get('/aboutus', getAllAboutUs);
router.delete('/aboutus/:id', deleteAboutUs);
// toggleAboutUsStatus

router.put("/aboutus/:id/toggle-status" , toggleAboutUsStatus)

module.exports = router;
