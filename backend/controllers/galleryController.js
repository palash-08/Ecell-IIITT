const GalleryItem = require('../models/GalleryItem');
const logger = require('../utils/logger');

// @desc    Get all gallery items
// @route   GET /api/gallery
exports.getGalleryItems = async (req, res) => {
    try {
        const { limit, event } = req.query;
        let query = {};
        
        if (event) {
            query.event = event;
        }

        let galleryQuery = GalleryItem.find(query).sort({ date: -1 });
        
        if (limit) {
            galleryQuery = galleryQuery.limit(parseInt(limit));
        }

        const gallery = await galleryQuery;
        res.status(200).json({ success: true, count: gallery.length, data: gallery });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Add gallery item
// @route   POST /api/gallery
exports.addGalleryItem = async (req, res) => {
    try {
        const galleryData = { ...req.body };
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        const fileSize = req.file.size;
        galleryData.url = `/uploads/gallery/${req.file.filename}`;
        galleryData.size = fileSize;

        // Check 30MB limit if associated with an event
        if (galleryData.event) {
            const Event = require('../models/Event');
            const event = await Event.findById(galleryData.event);
            
            if (event) {
                // Calculate total size of GalleryItems for this event
                const galleryItems = await GalleryItem.find({ event: galleryData.event });
                const existingGallerySize = galleryItems.reduce((acc, item) => acc + (item.size || 0), 0);
                
                // Calculate size of images in the Event model itself
                const eventMainImageSize = event.mainImageSize || 0;
                const eventGallerySize = (event.galleryImages || []).reduce((acc, img) => acc + (img.size || 0), 0);
                
                const totalUsed = existingGallerySize + eventMainImageSize + eventGallerySize;
                const LIMIT = 30 * 1024 * 1024; // 30MB

                if (totalUsed + fileSize > LIMIT) {
                    // Delete the uploaded file since it exceeds limit
                    const fs = require('fs');
                    const path = require('path');
                    fs.unlinkSync(path.join(__dirname, '..', galleryData.url));
                    
                    return res.status(400).json({ 
                        success: false, 
                        error: `Storage limit exceeded for this event. 30MB maximum. Current usage: ${(totalUsed / (1024 * 1024)).toFixed(2)}MB` 
                    });
                }
            }
        }

        const item = await GalleryItem.create(galleryData);
        logger.info(`✅ Successfully added gallery item: ${item._id}`);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        logger.error(`❌ Failed to add gallery item: ${error.message}`);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
exports.deleteGalleryItem = async (req, res) => {
    try {
        const item = await GalleryItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        
        logger.info(`✅ Successfully deleted gallery item: ${item._id}`);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        logger.error(`❌ Failed to delete gallery item ${req.params.id}: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};
