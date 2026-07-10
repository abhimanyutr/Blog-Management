const multer = require('multer')

// create Storage and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const date = new Date().toDateString();
    const uniqueName = `IMG-${file.originalname}-${date}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = ['image/png', 'image/jpg', 'image/jpeg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG and PNG images are allowed"), false);
  }
};

// Multer object
const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;