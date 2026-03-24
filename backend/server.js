const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// --- Security Middleware ---
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
})); // Set security HTTP headers with cross-origin allowed for media

// General Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', limiter);

// Stricter Rate Limiting for Auth (Login/Register)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 requests per hour
    message: { success: false, error: 'Too many auth attempts from this IP, please try again after an hour' }
});
app.use('/api/auth', authLimiter);

// --- Standard Middleware ---
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically - Ensure CORS applies here
app.use('/uploads', cors(), express.static('uploads')); 

// Request tracking middleware to verify frontend connectivity
app.use((req, res, next) => {
    logger.info(`🔌 Incoming frontend connection -> ${req.method} ${req.originalUrl}`);
    next();
});

// Basic Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'success', 
        message: 'E-Cell Backend API is running.',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/events', require('./routes/events'));
app.use('/api/team', require('./routes/team'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gallery', require('./routes/gallery'));

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`❌ Backend Error: ${err.message}`, err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    logger.info(`✅ E-Cell Backend Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    logger.info('✅ Backend is fully powered up and ready for all database and API operations.');
});
