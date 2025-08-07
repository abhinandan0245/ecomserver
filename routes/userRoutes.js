// const express = require('express');
// const { signup, login, getProfile, updateProfile, changePassword, uploadProfileImage, deleteAccount } = require('../controllers/userController');
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();
// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });

// const upload = multer({ storage });

// router.post('/signup',   signup);
// router.post('/login',  login);
// router.get('/profile', authMiddleware, getProfile); // 👈 protected route
// router.put('/profile', authMiddleware, updateProfile);
// router.put('/password', authMiddleware, changePassword);
// router.post('/upload', authMiddleware, upload.single('profileImage'), uploadProfileImage);
// router.delete('/', authMiddleware, deleteAccount);

// module.exports = router;



const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  deleteAccount,
} = require('../controllers/userController');

const { authAdmin } = require('../middleware/authMiddleware'); //  Make sure this file exports `authAdmin`
const upload = require('../middleware/upload'); // Centralized multer setup

// Auth Routes
router.post('/signup', signup); // You can restrict/remove this after first admin
router.post('/login', login);

// Admin Protected Routes
router.get('/profile', authAdmin, getProfile);
router.put('/profile', authAdmin, updateProfile);
router.put('/password', authAdmin, changePassword);
router.post('/upload', authAdmin, upload.single('profileImage'), uploadProfileImage);
router.delete('/delete', authAdmin, deleteAccount);

module.exports = router;
