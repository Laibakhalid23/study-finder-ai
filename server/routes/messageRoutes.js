const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations,deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth'); 

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.delete('/:id', protect, deleteMessage);

module.exports = router;