const GalleryItem = require('../models/GalleryItem');

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
        if (req.file) {
            galleryData.url = `/uploads/gallery/${req.file.filename}`;
        }
        const item = await GalleryItem.create(galleryData);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
exports.deleteGalleryItem = async (req, res) => {
    try {
        const item = await GalleryItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
