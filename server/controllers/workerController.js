const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get assigned orders for worker
// @route   GET /api/workers/my-orders
// @access  Private (Worker)
exports.getMyAssignedOrders = async (req, res) => {
    try {
        const { status } = req.query;

        let filter = { assignedWorker: req.user.id };

        if (status) {
            filter.status = status;
        } else {
            filter.status = { $in: ['assigned', 'in-transit'] };
        }

        const orders = await Order.find(filter)
            .populate('customerId', 'name email phone address')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Get today's assigned orders
// @route   GET /api/workers/today-orders
// @access  Private (Worker)
exports.getTodayOrders = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            assignedWorker: req.user.id,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['assigned', 'in-transit'] }
        }).populate('customerId', 'name phone address');

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Update order status
// @route   PUT /api/workers/orders/:id/status
// @access  Private (Worker)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (order.assignedWorker.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const validStatuses = ['in-transit', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        order.status = status;

        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        await order.save();

        // ✅ Send email notification
        const { sendOrderStatusUpdate } = require('../utils/emailService');
        if (order.customerId && order.customerId.email) {
            const worker = await User.findById(req.user.id);
            await sendOrderStatusUpdate(
                order.customerId.email,
                order.customerId.name,
                order._id.toString(),
                status,
                worker.name
            );
        }

        const io = req.app.get('io');
        if (io) {
            io.to(order.customerId._id.toString()).emit('orderStatusUpdated', order);
        }

        res.json({ msg: 'Order status updated successfully', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Get customer details for order
// @route   GET /api/workers/orders/:id/customer
// @access  Private (Worker)
exports.getCustomerDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email phone address');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (order.assignedWorker.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        res.json({
            customer: order.customerId,
            deliveryAddress: order.deliveryAddress,
            items: order.items
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Get worker statistics & earnings
// @route   GET /api/workers/stats
// @access  Private (Worker)
exports.getWorkerStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments({
            assignedWorker: req.user.id
        });

        const deliveredOrders = await Order.countDocuments({
            assignedWorker: req.user.id,
            status: 'delivered'
        });

        const pendingOrders = await Order.countDocuments({
            assignedWorker: req.user.id,
            status: { $in: ['assigned', 'in-transit'] }
        });

        // ✅ Calculate total bottles delivered
        const orders = await Order.find({
            assignedWorker: req.user.id,
            status: 'delivered'
        });

        let totalBottles = 0;
        orders.forEach(order => {
            order.items.forEach(item => {
                totalBottles += item.quantity;
            });
        });

        // ✅ Calculate earnings (Rs 20 per bottle)
        const totalEarnings = totalBottles * 20;

        // ✅ Today's earnings
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayOrders = await Order.find({
            assignedWorker: req.user.id,
            status: 'delivered',
            deliveredAt: { $gte: startOfDay, $lte: endOfDay }
        });

        let todayBottles = 0;
        todayOrders.forEach(order => {
            order.items.forEach(item => {
                todayBottles += item.quantity;
            });
        });

        const todayEarnings = todayBottles * 20;

        res.json({
            totalOrders,
            deliveredOrders,
            pendingOrders,
            totalBottles,
            totalEarnings,
            todayBottles,
            todayEarnings
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ✅ NEW: Get earnings breakdown
// @desc    Get earnings breakdown
// @route   GET /api/workers/earnings
// @access  Private (Worker)
exports.getEarnings = async (req, res) => {
    try {
        const { period } = req.query; // 'today', 'week', 'month', 'all'

        let startDate = new Date(0); // Default: all time

        if (period === 'today') {
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
        } else if (period === 'week') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        } else if (period === 'month') {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
        }

        const orders = await Order.find({
            assignedWorker: req.user.id,
            status: 'delivered',
            deliveredAt: { $gte: startDate }
        }).sort({ deliveredAt: -1 });

        let totalBottles = 0;
        const breakdown = orders.map(order => {
            let bottles = 0;
            order.items.forEach(item => {
                bottles += item.quantity;
            });
            totalBottles += bottles;

            return {
                orderId: order._id,
                date: order.deliveredAt,
                bottles: bottles,
                earnings: bottles * 20
            };
        });

        res.json({
            period,
            totalBottles,
            totalEarnings: totalBottles * 20,
            breakdown
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = exports;
