// ================================================================
// Shreedha Vastra — Backend Server Entry Point
// ================================================================
// This file boots the Express app: loads env vars, connects to
// MongoDB, wires up all middleware (security, logging, parsing),
// mounts API routes, and starts listening for requests.
// ================================================================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { handleWebhook } from './controllers/paymentController.js'
import couponRoutes from './routes/couponRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables from .env

// Connect to MongoDB (defined in config/db.js — built next)
connectDB();

const app = express();

// ----------------------------------------------------------------
// Security Middleware
// ----------------------------------------------------------------

// Sets secure HTTP headers (prevents common attacks like clickjacking)
app.use(helmet());

// Restricts which frontend origins can call this API
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // allows cookies (JWT) to be sent cross-origin
  })
);

// Rate limiter — protects the whole API from abuse/brute-force.
// Stricter limits for auth routes will be added on top of this later.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(globalLimiter);

// ----------------------------------------------------------------
// Core Middleware
// ----------------------------------------------------------------
// Razorpay webhook — must be registered BEFORE express.json() below.
// Razorpay signs the raw, unparsed bytes of the request body, so this
// route needs express.raw() instead of the normal JSON parser, or
// signature verification will always fail.
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);
// Parses incoming JSON request bodies (e.g. POST /api/products)
app.use(express.json({ limit: '10kb' }));

// Parses URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Reads JWT tokens from httpOnly cookies
app.use(cookieParser());

// Gzip-compresses responses for faster load times
app.use(compression());

// Logs HTTP requests to the console (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ----------------------------------------------------------------
// Health Check Route
// ----------------------------------------------------------------
// Useful for confirming the server is alive (and for uptime
// monitors once deployed).
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shreedha Vastra API is running',
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------------------
// API Routes
// ----------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/admin', adminRoutes);

// Note: cart and wishlist are handled as sub-routes under /api/users
// (see userRoutes.js) since they live on the User model itself.

// ----------------------------------------------------------------
// Error Handling (must be last)
// ----------------------------------------------------------------

// Catches requests to routes that don't exist
app.use(notFound);

// Catches all errors passed via next(err) and sends a clean JSON response
app.use(errorHandler);

// ----------------------------------------------------------------
// Start Server
// ----------------------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Shreedha Vastra API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections gracefully (e.g. DB connection failures)
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
