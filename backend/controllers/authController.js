const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

        sendTokenResponse(user, 201, res);
    } catch (err) {
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
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials (USer not found)'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials (Password incorrect)'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
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
