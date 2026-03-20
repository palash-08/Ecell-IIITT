const express = require('express');
const router = express.Router();
const {
  getFaculty,
  getSingleFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require('../controllers/facultyController');
const upload = require('../utils/upload');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFaculty)
  .post(protect, authorize('admin', 'super-admin'), upload.single('image'), createFaculty);

router.route('/:id')
  .get(getSingleFaculty)
  .put(protect, authorize('admin', 'super-admin'), upload.single('image'), updateFaculty)
  .delete(protect, authorize('admin', 'super-admin'), deleteFaculty);

module.exports = router;
