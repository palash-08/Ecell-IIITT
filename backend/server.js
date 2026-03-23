const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve uploaded images statically

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
