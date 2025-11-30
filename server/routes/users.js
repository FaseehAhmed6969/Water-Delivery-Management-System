const express = require('express');
const router = express.Router();
const {
    updateProfile,
    getLoyaltyPoints,
    redeemLoyaltyPoints,
    changePassword
} = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   GET /api/users/loyalty-points
// @desc    Get loyalty points
// @access  Private (Customer)
router.get('/loyalty-points', auth, authorize('customer'), getLoyaltyPoints);

// @route   POST /api/users/redeem-points
// @desc    Redeem loyalty points
// @access  Private (Customer)
router.post('/redeem-points', auth, authorize('customer'), redeemLoyaltyPoints);

// @route   PUT /api/users/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', auth, changePassword);

module.exports = router;
