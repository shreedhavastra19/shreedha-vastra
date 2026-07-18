// ================================================================
// Shreedha Vastra — Admin Dashboard Routes
// ================================================================
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getDashboardStats, getSalesReport } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/sales-report', getSalesReport);

export default router;
