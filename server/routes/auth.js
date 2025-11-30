const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');
const { auth } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, getUser);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', resetPassword);

module.exports = router;
