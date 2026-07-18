// ================================================================
// Shreedha Vastra — Cloudinary Configuration
// ================================================================
// Configures the Cloudinary SDK and exports helpers to upload a
// local buffer/file to Cloudinary and delete an image by its
// public_id (used when an admin replaces or removes a photo).
// ================================================================

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads a base64/data-URI or file path buffer to a given folder
const uploadImage = (fileStr, folder = 'shreedha-vastra/products') => {
  return cloudinary.uploader.upload(fileStr, {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto:good', fetch_format: 'auto' }], // auto-optimizes for performance
  });
};

// Deletes an image from Cloudinary by its public_id
const deleteImage = (publicId) => {
  if (!publicId) return Promise.resolve();
  return cloudinary.uploader.destroy(publicId);
};

export { cloudinary, uploadImage, deleteImage };
