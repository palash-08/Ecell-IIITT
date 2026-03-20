const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    venue: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Flagship', 'Hackathon', 'Workshop', 'Seminar', 'Other']
    },
    status: { 
        type: String, 
        default: 'Upcoming',
        enum: ['Upcoming', 'Completed']
    },
    mainImage: { type: String },
    galleryImages: [{ type: String }],
    
    // Dynamic Registration Form schema stored as an array of JSON objects
    customFormSchema: [{
        id: { type: String, required: true },
        type: { type: String, required: true },
        label: { type: String, required: true },
        required: { type: Boolean, default: false },
        systematic: { type: Boolean, default: false },
        options: [{ type: String }], // For select, radio, checkbox
        maxSize: { type: Number }, // For file upload (in MB)
        fileType: { type: String } // For file upload (e.g., "image/*", ".pdf")
    }],
    
    // Dynamic Highlights (e.g., "Expected Participants", "Speakers")
    highlights: [{
        label: { type: String, required: true },
        value: { type: String, required: true }
    }],
    
    // External Links (e.g., G-Meet, Registration Link, etc.)
    externalLinks: [{
        label: { type: String, required: true },
        url: { type: String, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
