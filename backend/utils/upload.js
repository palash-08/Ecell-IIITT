const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = 'uploads/';
        if (req.originalUrl.includes('events')) dest += 'events/';
        else if (req.originalUrl.includes('team')) dest += 'team/';
        else if (req.originalUrl.includes('faculty')) dest += 'faculty/';
        else if (req.originalUrl.includes('registrations')) dest += 'registrations/';
        else if (req.originalUrl.includes('gallery')) dest += 'gallery/';
        
        createDir(dest);
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|mp4|webm|ogg|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname || mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpeg, jpg, png, webp) and videos (mp4, webm, ogg, mov) are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
    fileFilter: fileFilter
});

module.exports = upload;
