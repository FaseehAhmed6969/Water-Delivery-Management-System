const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Update user profile (Story 12-13)
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json({ msg: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get loyalty points (Story 30)
// @route   GET /api/users/loyalty-points
// @access  Private (Customer)
exports.getLoyaltyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('loyaltyPoints');
    res.json({ loyaltyPoints: user.loyaltyPoints });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Redeem loyalty points (Story 30)
// @route   POST /api/users/redeem-points
// @access  Private (Customer)
exports.redeemLoyaltyPoints = async (req, res) => {
  try {
    const { pointsToRedeem } = req.body;

    const user = await User.findById(req.user.id);

    if (user.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({ msg: 'Insufficient loyalty points' });
    }

    // 1 point = ₹1 discount
    const discountAmount = pointsToRedeem;

    user.loyaltyPoints -= pointsToRedeem;
    await user.save();

    res.json({ 
      msg: 'Points redeemed successfully',
      discountAmount,
      remainingPoints: user.loyaltyPoints 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    // Validate current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = exports;
