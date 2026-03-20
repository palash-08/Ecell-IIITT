const express = require('express');
const router = express.Router();
const { 
    getGalleryItems, 
    addGalleryItem, 
    deleteGalleryItem 
} = require('../controllers/galleryController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

router.route('/')
    .get(getGalleryItems)
    .post(protect, authorize('admin', 'super-admin'), upload.single('media'), addGalleryItem);

router.route('/:id')
    .delete(protect, authorize('admin', 'super-admin'), deleteGalleryItem);

module.exports = router;
