const express = require('express');
const router = express.Router();
const { 
    submitMessage, 
    getMessages,
    deleteMessage 
} = require('../controllers/contactController');

router.route('/')
    .get(getMessages)
    .post(submitMessage);

router.route('/:id')
    .delete(deleteMessage);

module.exports = router;
