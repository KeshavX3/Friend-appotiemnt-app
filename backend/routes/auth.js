const express = require('express');
const router = express.Router();
const { register, login, getFriends } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/friends', getFriends);

module.exports = router;
