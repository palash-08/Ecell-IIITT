const Event = require('../models/Event');
const logger = require('../utils/logger');

// @desc    Get all events
// @route   GET /api/events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
exports.createEvent = async (req, res) => {
    try {
        const eventData = { ...req.body };
        let totalSize = 0;
        
        // Handle image uploads from multiple fields
        if (req.files) {
            if (req.files.mainImage) {
                const file = req.files.mainImage[0];
                eventData.mainImage = `/uploads/events/${file.filename}`;
                eventData.mainImageSize = file.size;
                totalSize += file.size;
            }
            if (req.files.galleryImages) {
                eventData.galleryImages = req.files.galleryImages.map(file => {
                    totalSize += file.size;
                    return {
                        url: `/uploads/events/${file.filename}`,
                        size: file.size
                    };
                });
            }
        }

        const LIMIT = 30 * 1024 * 1024;
        if (totalSize > LIMIT) {
            // Cleanup uploaded files
            cleanupFiles(req.files);
            return res.status(400).json({ success: false, error: `Total media for event exceeds 30MB limit.` });
        }

        // Parse JSON strings
        if (typeof eventData.customFormSchema === 'string') eventData.customFormSchema = JSON.parse(eventData.customFormSchema);
        if (typeof eventData.highlights === 'string') eventData.highlights = JSON.parse(eventData.highlights);
        if (typeof eventData.externalLinks === 'string') eventData.externalLinks = JSON.parse(eventData.externalLinks);

        const event = await Event.create(eventData);
        logger.info(`✅ Successfully created new event: ${event.title || event._id}`);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        cleanupFiles(req.files);
        logger.error(`❌ Failed to create new event: ${error.message}`);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res) => {
    try {
        const existingEvent = await Event.findById(req.params.id);
        if (!existingEvent) return res.status(404).json({ success: false, message: 'Event not found' });

        let eventData = { ...req.body };
        let currentTotalSize = 0;

        // Parse JSON strings
        if (typeof eventData.customFormSchema === 'string') eventData.customFormSchema = JSON.parse(eventData.customFormSchema);
        if (typeof eventData.highlights === 'string') eventData.highlights = JSON.parse(eventData.highlights);
        if (typeof eventData.externalLinks === 'string') eventData.externalLinks = JSON.parse(eventData.externalLinks);

        // Handle existing gallery images being kept
        let galleryToKeep = [];
        if (eventData.galleryImagesPaths) {
            const pathsToKeep = JSON.parse(eventData.galleryImagesPaths);
            galleryToKeep = existingEvent.galleryImages.filter(img => pathsToKeep.includes(img.url));
            currentTotalSize += galleryToKeep.reduce((acc, img) => acc + (img.size || 0), 0);
        }

        // Handle main image
        if (req.files && req.files.mainImage) {
            const file = req.files.mainImage[0];
            eventData.mainImage = `/uploads/events/${file.filename}`;
            eventData.mainImageSize = file.size;
            currentTotalSize += file.size;
        } else {
            eventData.mainImage = existingEvent.mainImage;
            eventData.mainImageSize = existingEvent.mainImageSize || 0;
            currentTotalSize += eventData.mainImageSize;
        }

        // Handle new gallery images
        if (req.files && req.files.galleryImages) {
            const newGalleryImages = req.files.galleryImages.map(file => {
                currentTotalSize += file.size;
                return {
                    url: `/uploads/events/${file.filename}`,
                    size: file.size
                };
            });
            eventData.galleryImages = [...galleryToKeep, ...newGalleryImages];
        } else {
            eventData.galleryImages = galleryToKeep;
        }

        // Check GalleryItem sizes for this event
        const GalleryItem = require('../models/GalleryItem');
        const galleryItems = await GalleryItem.find({ event: req.params.id });
        const galleryItemsSize = galleryItems.reduce((acc, item) => acc + (item.size || 0), 0);
        
        const totalSize = currentTotalSize + galleryItemsSize;
        const LIMIT = 30 * 1024 * 1024;

        if (totalSize > LIMIT) {
            cleanupFiles(req.files);
            return res.status(400).json({ 
                success: false, 
                error: `Total media for event exceeds 30MB limit. Current usage: ${(totalSize / (1024 * 1024)).toFixed(2)}MB` 
            });
        }

        const event = await Event.findByIdAndUpdate(req.params.id, eventData, {
            new: true,
            runValidators: true
        });

        logger.info(`✅ Successfully updated event: ${event.title || event._id}`);
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        cleanupFiles(req.files);
        logger.error(`❌ Failed to update event ${req.params.id}: ${error.message}`);
        res.status(400).json({ success: false, error: error.message });
    }
};

// Helper function to cleanup uploaded files on error
const cleanupFiles = (files) => {
    if (!files) return;
    const fs = require('fs');
    const path = require('path');
    
    Object.keys(files).forEach(key => {
        files[key].forEach(file => {
            const filePath = path.join(__dirname, '..', 'uploads', 'events', file.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
    });
};

// @desc    Delete event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        logger.info(`✅ Successfully deleted event: ${event.title || event._id}`);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        logger.error(`❌ Failed to delete event ${req.params.id}: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};
