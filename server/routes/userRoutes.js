const express = require('express');
const router = express.Router();
const { registerUser, loginUser, findPeers, getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/peers', protect, findPeers);

module.exports = router;