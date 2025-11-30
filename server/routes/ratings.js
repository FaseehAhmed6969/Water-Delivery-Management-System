const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');

// @route   POST /api/ratings
// @desc    Create rating for delivered order
// @access  Private (Customer)
router.post('/', auth, authorize('customer'), async (req, res) => {
    try {
        const { orderId, rating, feedback, deliverySpeed, productQuality } = req.body;

        // Check if order exists and belongs to customer
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (order.customerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        if (order.status !== 'delivered') {
            return res.status(400).json({ msg: 'Can only rate delivered orders' });
        }

        // Check if rating already exists
        const existingRating = await Rating.findOne({ orderId });
        if (existingRating) {
            return res.status(400).json({ msg: 'Order already rated' });
        }

        const newRating = new Rating({
            orderId,
            customerId: req.user.id,
            workerId: order.assignedWorker,
            rating,
            feedback,
            deliverySpeed,
            productQuality
        });

        await newRating.save();

        res.json({ msg: 'Rating submitted successfully', rating: newRating });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/ratings/order/:orderId
// @desc    Get rating for specific order
// @access  Private
router.get('/order/:orderId', auth, async (req, res) => {
    try {
        const rating = await Rating.findOne({ orderId: req.params.orderId })
            .populate('customerId', 'name')
            .populate('workerId', 'name');

        if (!rating) {
            return res.status(404).json({ msg: 'No rating found for this order' });
        }

        res.json(rating);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/ratings/my-ratings
// @desc    Get all ratings by customer
// @access  Private (Customer)
router.get('/my-ratings', auth, authorize('customer'), async (req, res) => {
    try {
        const ratings = await Rating.find({ customerId: req.user.id })
            .populate('orderId')
            .sort({ createdAt: -1 });

        res.json(ratings);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
