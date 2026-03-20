const Faculty = require('../models/Faculty');
const fs = require('fs');
const path = require('path');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Public
exports.getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Public
exports.getSingleFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }
    res.status(200).json({ success: true, data: faculty });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create faculty
// @route   POST /api/faculty
// @access  Private
exports.createFaculty = async (req, res) => {
  try {
    const facultyData = { ...req.body };
    
    if (req.file) {
      facultyData.image = `/uploads/faculty/${req.file.filename}`;
    }

    const faculty = await Faculty.create(facultyData);
    res.status(201).json({ success: true, data: faculty });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private
exports.updateFaculty = async (req, res) => {
  try {
    const facultyData = { ...req.body };
    
    if (req.file) {
      facultyData.image = `/uploads/faculty/${req.file.filename}`;
      // Optional: Delete old image
      const oldFaculty = await Faculty.findById(req.params.id);
      if (oldFaculty && oldFaculty.image) {
        const oldImagePath = path.join(__dirname, '..', oldFaculty.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const faculty = await Faculty.findByIdAndUpdate(req.params.id, facultyData, {
      new: true,
      runValidators: true
    });

    if (!faculty) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }

    res.status(200).json({ success: true, data: faculty });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }

    // Delete image file
    if (faculty.image) {
      const imagePath = path.join(__dirname, '..', faculty.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await faculty.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
