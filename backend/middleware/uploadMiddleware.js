// ================================================================
// Shreedha Vastra — Upload Middleware (Multer)
// ================================================================
// Receives multipart/form-data image uploads into memory (not
// disk), validates file type and size, then hands off a buffer
// that controllers convert to a data URI and send to Cloudinary.
// ================================================================

import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// Converts a multer file buffer into a base64 data URI for Cloudinary upload
const bufferToDataURI = (file) => {
  const b64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${b64}`;
};

export { upload, bufferToDataURI };
