const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    category: { type: String, required: true }, // Core, Tech, PR, Alumni
    company: { type: String }, // Relevant for Alumni
    batch: { type: String }, // Relevant for Alumni
    image: { type: String },
    linkedin: { type: String },
    email: { type: String, required: true },
    formerPosition: { type: String }, // For Alumni
    joinDate: { type: String },
    active: { type: Boolean, default: true } // False typically for Alumni
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
