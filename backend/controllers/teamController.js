const TeamMember = require('../models/TeamMember');

// @desc    Get all team members
// @route   GET /api/team
exports.getTeamMembers = async (req, res) => {
    try {
        const team = await TeamMember.find().sort({ createdAt: -1 });
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
        res.status(201).json({ success: true, data: member });
    } catch (error) {
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

        res.status(200).json({ success: true, data: member });
    } catch (error) {
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
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
