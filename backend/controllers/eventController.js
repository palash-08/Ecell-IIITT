const Event = require('../models/Event');

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
        
        // Handle image uploads from multiple fields
        if (req.files) {
            if (req.files.mainImage) {
                eventData.mainImage = `/uploads/events/${req.files.mainImage[0].filename}`;
            }
            if (req.files.galleryImages) {
                const newGalleryImages = req.files.galleryImages.map(file => `/uploads/events/${file.filename}`);
                eventData.galleryImages = [...(eventData.galleryImages || []), ...newGalleryImages];
            }
        }

        // Parse JSON strings if they are sent as strings (common with multipart/form-data)
        if (typeof eventData.customFormSchema === 'string') {
            eventData.customFormSchema = JSON.parse(eventData.customFormSchema);
        }
        if (typeof eventData.highlights === 'string') {
            eventData.highlights = JSON.parse(eventData.highlights);
        }
        if (typeof eventData.externalLinks === 'string') {
            eventData.externalLinks = JSON.parse(eventData.externalLinks);
        }

        const event = await Event.create(eventData);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res) => {
    try {
        let eventData = { ...req.body };

        // Parse JSON strings from multipart/form-data
        if (eventData.customFormSchema) eventData.customFormSchema = JSON.parse(eventData.customFormSchema);
        if (eventData.highlights) eventData.highlights = JSON.parse(eventData.highlights);
        if (eventData.externalLinks) eventData.externalLinks = JSON.parse(eventData.externalLinks);

        // Handle Gallery Images: merge existing paths with new uploads
        let galleryToKeep = [];
        if (eventData.galleryImagesPaths) {
            galleryToKeep = JSON.parse(eventData.galleryImagesPaths);
        }

        if (req.files) {
            if (req.files.mainImage) {
                eventData.mainImage = `/uploads/events/${req.files.mainImage[0].filename}`;
            }
            if (req.files.galleryImages) {
                const newGalleryImages = req.files.galleryImages.map(file => `/uploads/events/${file.filename}`);
                eventData.galleryImages = [...galleryToKeep, ...newGalleryImages];
            } else {
                eventData.galleryImages = galleryToKeep;
            }
        } else {
            eventData.galleryImages = galleryToKeep;
        }

        const event = await Event.findByIdAndUpdate(req.params.id, eventData, {
            new: true,
            runValidators: true
        });

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({ success: true, data: event });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
