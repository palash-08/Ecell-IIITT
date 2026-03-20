const express = require('express');
const router = express.Router();
const { 
    registerEvent, 
    getEventRegistrations, 
    getAllRegistrations,
    getMyRegistrations,
    checkRegistration
} = require('../controllers/registrationController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

router.route('/')
    .get(protect, authorize('admin', 'super-admin'), getAllRegistrations)
    .post(protect, upload.any(), registerEvent);

router.route('/my')
    .get(protect, getMyRegistrations);

router.route('/check/:eventId')
    .get(protect, checkRegistration);

router.route('/event/:eventId')
    .get(protect, authorize('admin', 'super-admin'), getEventRegistrations);

module.exports = router;
