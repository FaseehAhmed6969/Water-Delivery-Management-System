const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

// Global variable to store ordering status
let orderingStatus = {
    paused: false,
    pausedAt: null,
    pausedBy: null
};

// Test route
router.get('/test', auth, authorize('admin'), (req, res) => {
    res.json({ msg: 'Admin routes working!' });
});

// Get all orders
router.get('/orders', auth, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId', 'name email phone')
            .populate('workerId', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Assign order to worker
router.put('/orders/:id/assign', auth, authorize('admin'), async (req, res) => {
    try {
        const { workerId } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { workerId, status: 'assigned' },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        console.error('Error assigning order:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Auto-assign orders
router.post('/orders/auto-assign', auth, authorize('admin'), async (req, res) => {
    try {
        const pendingOrders = await Order.find({ status: 'pending' });
        const workers = await User.find({ role: 'worker' });

        if (workers.length === 0) {
            return res.status(400).json({ msg: 'No workers available' });
        }

        let workerIndex = 0;
        for (const order of pendingOrders) {
            order.workerId = workers[workerIndex]._id;
            order.status = 'assigned';
            await order.save();
            workerIndex = (workerIndex + 1) % workers.length;
        }

        res.json({ msg: `${pendingOrders.length} orders auto-assigned` });
    } catch (error) {
        console.error('Error auto-assigning:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete order
router.delete('/orders/:id', auth, authorize('admin'), async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Order deleted' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get dashboard stats
router.get('/stats', auth, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.find();
        const customers = await User.find({ role: 'customer' });
        const workers = await User.find({ role: 'worker' });

        const stats = {
            orders: {
                total: orders.length,
                pending: orders.filter(o => o.status === 'pending').length,
                assigned: orders.filter(o => o.status === 'assigned').length,
                'in-transit': orders.filter(o => o.status === 'in-transit').length,
                delivered: orders.filter(o => o.status === 'delivered').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length
            },
            customers: customers.length,
            workers: workers.length,
            revenue: orders
                .filter(o => o.status === 'delivered')
                .reduce((sum, o) => sum + o.totalPrice, 0),
            todayRevenue: orders
                .filter(o => o.status === 'delivered' &&
                    new Date(o.deliveredAt).toDateString() === new Date().toDateString())
                .reduce((sum, o) => sum + o.totalPrice, 0)
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get ordering status
router.get('/ordering-status', auth, authorize('admin'), (req, res) => {
    try {
        res.json(orderingStatus);
    } catch (error) {
        console.error('Error getting ordering status:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Toggle ordering
router.post('/toggle-ordering', auth, authorize('admin'), (req, res) => {
    try {
        const { paused } = req.body;

        orderingStatus = {
            paused: paused,
            pausedAt: paused ? new Date() : orderingStatus.pausedAt,
            pausedBy: paused ? req.user.id : orderingStatus.pausedBy,
            resumedAt: !paused ? new Date() : null
        };

        global.orderingPaused = paused;

        res.json({
            msg: paused ? 'Ordering paused successfully' : 'Ordering resumed successfully',
            orderingStatus
        });
    } catch (error) {
        console.error('Error toggling ordering:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all customers
router.get('/customers', auth, authorize('admin'), async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' }).select('-password');
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all workers
router.get('/workers', auth, authorize('admin'), async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password');
        res.json(workers);
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
