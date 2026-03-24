const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
exports.submitMessage = async (req, res) => {
    try {
        const { name, email, message: text } = req.body;
        
        const contactMessage = await ContactMessage.create({ name, email, message: text });
        
        // Notify Admin via Email
        try {
            await sendEmail({
                email: process.env.FROM_EMAIL,
                subject: `New Contact Form Submission: ${name}`,
                message: `You have a new message from the contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${text}`
            });
            logger.info(`📧 Admin notified of new contact message from ${email}`);
        } catch (emailErr) {
            logger.error(`❌ Failed to send admin notification email: ${emailErr.message}`);
            // We don't return error to user if email fails, as message is already saved
        }

        res.status(201).json({ success: true, data: contactMessage });
    } catch (error) {
        logger.error(`❌ Contact form submission failed: ${error.message}`);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all messages (for admin)
// @route   GET /api/contact
exports.getMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// @desc    Delete message
// @route   DELETE /api/contact/:id
exports.deleteMessage = async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
