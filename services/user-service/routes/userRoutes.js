const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('/app/common/middleware/auth');


//api/user/register
// user register
router.post('/register', UserController.register);

// user login
router.post('/login', UserController.login);

// update user
router.put('/profile', authMiddleware, UserController.updateProfile);

// get user
router.get('/profile', authMiddleware, UserController.getProfile);

module.exports = router;