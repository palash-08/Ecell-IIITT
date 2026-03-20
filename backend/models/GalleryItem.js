const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    thumbnail: { type: String }, // For videos
    category: { type: String, default: 'Other' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);
