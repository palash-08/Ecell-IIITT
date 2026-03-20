const express = require('express');
const router = express.Router();
const { 
    getTeamMembers, 
    getTeamMemberById,
    createTeamMember, 
    updateTeamMember, 
    deleteTeamMember 
} = require('../controllers/teamController');
const upload = require('../utils/upload');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTeamMembers)
    .post(protect, authorize('admin', 'super-admin'), upload.single('image'), createTeamMember);

router.route('/:id')
    .get(getTeamMemberById)
    .put(protect, authorize('admin', 'super-admin'), upload.single('image'), updateTeamMember)
    .delete(protect, authorize('admin', 'super-admin'), deleteTeamMember);

module.exports = router;
