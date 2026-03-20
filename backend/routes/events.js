const express = require('express');
const router = express.Router();
const { 
    getEvents, 
    getEvent, 
    createEvent, 
    updateEvent, 
    deleteEvent 
} = require('../controllers/eventController');
const upload = require('../utils/upload');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getEvents)
    .post(protect, authorize('admin', 'super-admin'), upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 10 }
    ]), createEvent);

router.route('/:id')
    .get(getEvent)
    .put(protect, authorize('admin', 'super-admin'), upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 10 }
    ]), updateEvent)
    .delete(protect, authorize('admin', 'super-admin'), deleteEvent);

module.exports = router;
