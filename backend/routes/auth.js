const express = require('express');
const {
    register,
    login,
    getMe,
    getAdmins,
    addAdmin,
    removeAdmin,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.get('/me', protect, getMe);

// Admin management routes (Super Admin only)
router.route('/admins')
    .get(protect, authorize('super-admin'), getAdmins)
    .post(protect, authorize('super-admin'), addAdmin);

router.route('/admins/:id')
    .delete(protect, authorize('super-admin'), removeAdmin);

module.exports = router;
