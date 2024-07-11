const multer = require('multer');
const { createDirectory } = require('../utils').fileUtil;

// Set up storage for uploaded profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    createDirectory('public/users/');
    cb(null, 'public/users/');
  },
  filename: (req, file, cb) => {
    const hash = req.user.hash.toLowerCase() || Date.now();
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${hash}.${fileExtension}`;
    cb(null, fileName);
  }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/tiff'];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('Invalid file type'));
  } else {
    cb(null, true);
  }
};

// Create the multer instance with file size limit and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: fileFilter
});

module.exports = upload;