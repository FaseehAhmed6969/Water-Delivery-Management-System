const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @route   POST /api/issues
// @desc    Report an issue with order
// @access  Private (Customer)
router.post('/', auth, authorize('customer'), async (req, res) => {
    try {
        const { orderId, issueType, description } = req.body;

        // Verify order exists and belongs to customer
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (order.customerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const issue = new Issue({
            orderId,
            customerId: req.user.id,
            issueType,
            description
        });

        await issue.save();

        // Send email notification to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Admin email
            subject: 'New Customer Issue Reported',
            html: `
        <h3>New Issue Reported</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Issue Type:</strong> ${issueType}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Customer ID:</strong> ${req.user.id}</p>
      `
        };

        transporter.sendMail(mailOptions);

        res.json({ msg: 'Issue reported successfully', issue });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/issues/my-issues
// @desc    Get all issues reported by customer
// @access  Private (Customer)
router.get('/my-issues', auth, authorize('customer'), async (req, res) => {
    try {
        const issues = await Issue.find({ customerId: req.user.id })
            .populate('orderId')
            .sort({ createdAt: -1 });

        res.json(issues);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/issues
// @desc    Get all issues (Admin)
// @access  Private (Admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.query;

        let filter = {};
        if (status) filter.status = status;

        const issues = await Issue.find(filter)
            .populate('customerId', 'name email phone')
            .populate('orderId')
            .populate('resolvedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(issues);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT /api/issues/:id/resolve
// @desc    Resolve an issue (Admin)
// @access  Private (Admin)
router.put('/:id/resolve', auth, authorize('admin'), async (req, res) => {
    try {
        const { resolution, status } = req.body;

        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ msg: 'Issue not found' });
        }

        issue.status = status;
        issue.resolution = resolution;
        issue.resolvedBy = req.user.id;
        issue.resolvedAt = new Date();

        await issue.save();

        res.json({ msg: 'Issue updated successfully', issue });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
