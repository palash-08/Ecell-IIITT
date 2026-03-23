const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        logger.info(`New user registered: ${email}`);
        sendTokenResponse(user, 201, res);
    } catch (err) {
        logger.error(`Registration failed for ${req.body?.email || 'unknown'}: ${err.message}`);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            logger.warn(`Failed login attempt for unknown email: ${email}`);
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if account is temporarily locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
            logger.warn(`Login rejected for locked account: ${email}`);
            return res.status(401).json({
                success: false,
                error: `Account temporarily locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            
            if (user.loginAttempts >= 5) {
                user.lockUntil = Date.now() + 5 * 60 * 1000; // Lock for 5 minutes
                await user.save({ validateBeforeSave: false });
                logger.warn(`Account locked due to 5 failed attempts: ${email}`);
                return res.status(401).json({
                    success: false,
                    error: 'Too many failed login attempts. Account locked for 5 minutes.'
                });
            }
            
            await user.save({ validateBeforeSave: false });
            logger.warn(`Failed login attempt for: ${email} (${5 - user.loginAttempts} attempts remaining)`);
            return res.status(401).json({
                success: false,
                error: `Invalid credentials. ${5 - user.loginAttempts} attempt(s) remaining.`
            });
        }

        // Reset login attempts if successful
        if (user.loginAttempts > 0) {
            user.loginAttempts = 0;
            user.lockUntil = undefined;
            await user.save({ validateBeforeSave: false });
        }

        logger.info(`User logged in successfully: ${email}`);
        sendTokenResponse(user, 200, res);
    } catch (err) {
        logger.error(`Login error for ${req.body?.email || 'unknown'}: ${err.message}`);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all admins (Super Admin only)
// @route   GET /api/auth/admins
// @access  Private/Super-Admin
exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: { $in: ['admin', 'super-admin'] } });

        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Create/Promote to admin (Super Admin only)
// @route   POST /api/auth/admins
// @access  Private/Super-Admin
exports.addAdmin = async (req, res) => {
    try {
        const { email, role, name } = req.body;

        if (role && !['admin', 'super-admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid role'
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not found
            if (!name) {
                return res.status(400).json({
                    success: false,
                    error: 'User not found. Please provide a name to create a new admin account.'
                });
            }

            user = await User.create({
                name,
                email,
                password: 'admin@123',
                role: role || 'admin'
            });
            
            return res.status(201).json({
                success: true,
                message: 'New user created and promoted to admin',
                data: user
            });
        }

        user.role = role || 'admin';
        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Remove admin status (Super Admin only)
// @route   DELETE /api/auth/admins/:id
// @access  Private/Super-Admin
exports.removeAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Prevent deleting the last super admin if needed, but for now just demote
        user.role = 'user';
        await user.save();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'There is no user with that email'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP and set to resetPasswordOTP field
        user.resetPasswordOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // Set expire (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        const message = `Your password reset OTP is ${otp}. It will expire in 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message
            });

            logger.info(`Password reset requested for: ${user.email}`);

            res.status(200).json({
                success: true,
                data: 'Email sent'
            });
        } catch (err) {
            logger.error(`Failed to send OTP email to ${user.email}: ${err.message}`);
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                error: 'Email could not be sent'
            });
        }
    } catch (err) {
        logger.error(`Error in forgotPassword: ${err.message}`);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email, OTP and new password'
            });
        }

        // Get hashed OTP
        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordOTP: hashedOTP,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            logger.warn(`Invalid or expired OTP attempt for: ${email}`);
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired OTP'
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        logger.info(`Password successfully reset for: ${email}`);
        sendTokenResponse(user, 200, res);
    } catch (err) {
        logger.error(`Error in resetPassword for ${req.body?.email || 'unknown'}: ${err.message}`);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
