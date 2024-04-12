const multer = require('multer');

// Multer configuration
const storage = multer.memoryStorage(); // Store the file in memory

const upload = multer({
  storage: storage,
  limits: { fileSize: 10*1024*1024 }, // 10MB file size limit
})

module.exports = {
  storage, upload
}
