const multer = require('multer');
const path = require('path');
const ApiResponse = require('../utils/ApiResponse');
const { ERROR_CODES } = require('../utils/constants');

const storage = multer.memoryStorage(); // Use memory storage so we can process with sharp

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpeg, jpg, png)'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
