const express = require('express');
const router = express.Router();
const { login, getMe, createAdmin, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/register', protect, createAdmin);
router.put('/change-password', protect, changePassword);

module.exports = router;
