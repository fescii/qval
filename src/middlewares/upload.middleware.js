// Import necessary packages and modules
const multer = require('multer');
const { createDirectory } = require('../utils').fileUtil;


// Set up storage for uploaded profile pictures
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    createDirectory('public/users/');
    cb(null, 'public/users/');
  },
  filename: (req, file, cb) => {
    const hash = req.user.hash || Date.now();
    const fileExtension = file.originalname.split('.').pop();
    const fileName = hash + '.' + fileExtension;
    cb(null, fileName);
  }
});

// Function to check file size
const fileSizeFilter = (_req, file, cb) => {
  if (file.size > 10 * 1024 * 1024) { // 10MB file size limit
    cb(new Error('File size exceeds the limit of 10MB'));
  } else {
    cb(null, true);
  }
};

// Create the multer instance with file size limit and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: fileSizeFilter
});

module.exports = upload;