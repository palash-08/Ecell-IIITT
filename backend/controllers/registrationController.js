const Registration = require('../models/Registration');
const Event = require('../models/Event');
const logger = require('../utils/logger');

// @desc    Register for an event
// @route   POST /api/registrations
exports.registerEvent = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false, error: 'Request body is missing. Ensure you are sending form data correctly.' });
        }
        let { eventId, formData } = req.body;

        // Parse formData if it's sent as a string (common with multipart/form-data)
        if (typeof formData === 'string') {
            try {
                formData = JSON.parse(formData);
            } catch (e) {
                console.error('Error parsing formData:', e);
            }
        }

        // Handle uploaded files if any
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                // Map each file to its corresponding field label/id in formData
                formData[file.fieldname] = `/uploads/registrations/${file.filename}`;
            });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const registration = await Registration.create({
            event: eventId,
            user: req.user.id,
            formData
        });

        logger.info(`✅ Successfully registered user ${req.user.id} for event ${eventId}`);
        res.status(201).json({ success: true, data: registration });
    } catch (error) {
        logger.error(`❌ Failed event registration attempt: ${error.message}`);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get registrations for an event (Admin)
// @route   GET /api/registrations/event/:eventId
exports.getEventRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ event: req.params.eventId }).sort({ submittedAt: -1 });
        res.status(200).json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all registrations (Admin)
// @route   GET /api/registrations
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find().populate('event', 'title date').sort({ submittedAt: -1 });
        res.status(200).json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get user's own registrations
// @route   GET /api/registrations/my
exports.getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user.id }).populate('event', 'title date category venue').sort({ submittedAt: -1 });
        res.status(200).json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Check if user is registered for an event
// @route   GET /api/registrations/check/:eventId
exports.checkRegistration = async (req, res) => {
    try {
        const registration = await Registration.findOne({ 
            event: req.params.eventId,
            user: req.user.id 
        });
        
        res.status(200).json({ 
            success: true, 
            isRegistered: !!registration,
            registration: registration
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
