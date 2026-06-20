const express = require('express');
const router = express.Router();
const { registerUser, loginUser, findPeers} = require('../controllers/userController');
const { protect } = require('../middleware/auth.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/peers', protect, findPeers); // Only logged in users can find peers

module.exports = router;