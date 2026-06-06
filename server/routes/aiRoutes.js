const express = require('express');
const router = express.Router();
const { askTutor } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/ask', protect, askTutor);

module.exports = router;