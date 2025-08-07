const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage engine with dynamic folder support
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.uploadFolder || 'uploads'; // Default to 'uploads' if not set
    const dir = path.join(__dirname, '..', folder);

    // Create folder if it doesn't exist
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// File filter: only image files allowed
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|svg|webp|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit: 5MB
});

module.exports = upload;


// const multer = require('multer');
// const path = require('path');
// const sharp = require('sharp');
// const fs = require('fs');

// // Multer storage setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = req.uploadFolder || 'public/uploads/bannerImage';
//     fs.mkdirSync(folder, { recursive: true });
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// // Accept only image files
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|webp/;
//   const extname = path.extname(file.originalname).toLowerCase();
//   if (!allowedTypes.test(extname)) {    
//     return cb(new Error('Only image files are allowed (jpeg, png, webp)'), false);
//   }
//   cb(null, true);
// };

// // Multer instance
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
// });

// // ✅ Middleware to validate image size for banner uploads only
// const validateBannerDimensions = async (req, res, next) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ message: 'No banner images provided' });
//   }

//   const invalidFiles = [];

//   for (const file of req.files) {
//     try {
//       const { width, height } = await sharp(file.path).metadata();
//       if (width !== 1566 || height !== 659) {
//         invalidFiles.push(file.filename);
//         fs.unlinkSync(file.path); // Delete invalid image
//       }
//     } catch (err) {
//       console.error(`Failed to process ${file.filename}:`, err);
//       invalidFiles.push(file.filename);
//     }
//   }

//   if (invalidFiles.length > 0) {
//     return res.status(400).json({
//       message: `Only 1566x659px banners are allowed. Invalid files: ${invalidFiles.join(', ')}`,
//     });
//   }

//   next();
// };

// module.exports = {
//   upload,
//   validateBannerDimensions,
// };
