// ================================================================
// Shreedha Vastra — Admin Dashboard Controller
// ================================================================
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get dashboard summary stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalCustomers, revenueAgg, recentOrders, lowStockProducts] =
    await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
      ]),
      Order.find().populate('user', 'name').sort('-createdAt').limit(5),
      Product.aggregate([
        { $unwind: '$sizes' },
        { $group: { _id: '$_id', name: { $first: '$name' }, totalStock: { $sum: '$sizes.stock' } } },
        { $match: { totalStock: { $lte: 5 } } },
        { $limit: 10 },
      ]),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
      recentOrders,
      lowStockProducts,
    },
  });
});

// @desc    Get sales report grouped by day/month within a date range
// @route   GET /api/admin/sales-report?from=2026-01-01&to=2026-06-30&groupBy=month
// @access  Private/Admin
const getSalesReport = asyncHandler(async (req, res) => {
  const { from, to, groupBy = 'day' } = req.query;

  const match = { isPaid: true };
  if (from || to) {
    match.paidAt = {};
    if (from) match.paidAt.$gte = new Date(from);
    if (to) match.paidAt.$lte = new Date(to);
  }

  const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';

  const report = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$paidAt' } },
        totalSales: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Best-selling products within the same range
  const topProducts = await Order.aggregate([
    { $match: match },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        unitsSold: { $sum: '$orderItems.quantity' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({ success: true, report, topProducts });
});

export { getDashboardStats, getSalesReport };
