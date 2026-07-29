const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Required on Vercel/serverless so express-rate-limit reads the real client IP
// from X-Forwarded-For instead of throwing on the proxy hop.
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS — comma-separate multiple allowed origins in FRONTEND_URL if needed.
// Trailing slashes/case are stripped before comparing so a small mismatch
// in the env var (e.g. a trailing "/") doesn't silently block every request.
const normalizeOrigin = (o) => o.trim().replace(/\/+$/, '').toLowerCase();

const allowedOrigins = [
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL || '').split(',').map(o => o.trim()).filter(Boolean)
].map(normalizeOrigin);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) callback(null, true);
    else {
      console.error('CORS blocked origin:', origin, '| allowed:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/services', require('./routes/services'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/gallery', require('./routes/gallery'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Ridge Plumbing API is running', env: process.env.NODE_ENV });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB. Mongoose buffers queries until the connection is
// established, so it's safe to not await this before the app starts
// handling requests — required for serverless (Vercel) cold starts, where
// there is no long-lived process to block on a promise beforehand.
//
// `global._mongoConn` caches the connection promise across warm serverless
// invocations. Without this, every cold start opened a brand new connection
// pool that was never closed, which silently piled up connections on the
// shared Atlas cluster until it hit the cluster's connection limit —
// causing intermittent 500s across all routes.
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));

if (!global._mongoConn) {
  global._mongoConn = mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 10 });
}
global._mongoConn.catch(err => console.error('MongoDB connection error:', err));

// Only bind a port for local/traditional hosting. On Vercel the exported
// app is invoked directly as a serverless function handler.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
