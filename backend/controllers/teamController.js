const TeamMember = require('../models/TeamMember');
const logger = require('../utils/logger');

// @desc    Get all team members
// @route   GET /api/team
exports.getTeamMembers = async (req, res) => {
    try {
        const team = await TeamMember.find().sort({ createdAt: 1 });
        res.status(200).json({ success: true, count: team.length, data: team });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get team member by ID
// @route   GET /api/team/:id
exports.getTeamMemberById = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.status(200).json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new team member
// @route   POST /api/team
exports.createTeamMember = async (req, res) => {
    try {
        const memberData = { ...req.body };
        
        if (req.file) {
            memberData.image = `/uploads/team/${req.file.filename}`;
        }

        const member = await TeamMember.create(memberData);
        logger.info(`✅ Successfully created team member: ${member.name || member._id}`);
        res.status(201).json({ success: true, data: member });
    } catch (error) {
        logger.error(`❌ Failed to create team member: ${error.message}`);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update team member
// @route   PUT /api/team/:id
exports.updateTeamMember = async (req, res) => {
    try {
        let memberData = { ...req.body };

        if (req.file) {
            memberData.image = `/uploads/team/${req.file.filename}`;
        }

        const member = await TeamMember.findByIdAndUpdate(req.params.id, memberData, {
            new: true,
            runValidators: true
        });

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        logger.info(`✅ Successfully updated team member: ${member.name || member._id}`);
        res.status(200).json({ success: true, data: member });
    } catch (error) {
        logger.error(`❌ Failed to update team member ${req.params.id}: ${error.message}`);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
exports.deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        logger.info(`✅ Successfully deleted team member: ${member.name || member._id}`);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        logger.error(`❌ Failed to delete team member ${req.params.id}: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};
