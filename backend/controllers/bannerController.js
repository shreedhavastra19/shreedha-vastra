// ================================================================
// Shreedha Vastra — Banner Controller
// ================================================================
import asyncHandler from 'express-async-handler';
import Banner from '../models/Banner.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import { bufferToDataURI } from '../middleware/uploadMiddleware.js';

// @desc    Get active banners for a given position (e.g. hero)
// @route   GET /api/banners?position=hero
// @access  Public
const getActiveBanners = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.position) filter.position = req.query.position;

  const now = new Date();
  filter.startDate = { $lte: now };
  filter.$or = [{ endDate: null }, { endDate: { $gte: now } }];

  const banners = await Banner.find(filter).sort('displayOrder');
  res.status(200).json({ success: true, banners });
});

// ---------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------

// @desc    Get all banners (admin)
// @route   GET /api/banners/admin/all
// @access  Private/Admin
const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort('displayOrder');
  res.status(200).json({ success: true, banners });
});

// @desc    Create a banner (admin)
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
  const bannerData = { ...req.body };

  if (req.file) {
    const uploaded = await uploadImage(bufferToDataURI(req.file), 'shreedha-vastra/banners');
    bannerData.image = { url: uploaded.secure_url, public_id: uploaded.public_id };
  }

  const banner = await Banner.create(bannerData);
  res.status(201).json({ success: true, banner });
});

// @desc    Update a banner (admin)
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  if (req.file) {
    await deleteImage(banner.image?.public_id);
    const uploaded = await uploadImage(bufferToDataURI(req.file), 'shreedha-vastra/banners');
    req.body.image = { url: uploaded.secure_url, public_id: uploaded.public_id };
  }

  Object.assign(banner, req.body);
  await banner.save();

  res.status(200).json({ success: true, banner });
});

// @desc    Delete a banner (admin)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  await deleteImage(banner.image?.public_id);
  await banner.deleteOne();

  res.status(200).json({ success: true, message: 'Banner deleted successfully' });
});

export { getActiveBanners, getAllBanners, createBanner, updateBanner, deleteBanner };
