const Order = require('../models/Order');
const User = require('../models/User');
const PromoCode = require('../models/PromoCode');
const PricingRule = require('../models/PricingRule');
const Notification = require('../models/Notification');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, promoCode } = req.body;

        if (!items || items.length === 0 || !deliveryAddress) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        // Calculate base price
        let totalPrice = 0;
        items.forEach(item => {
            const priceMap = { '5L': 50, '10L': 90, '20L': 170 };
            totalPrice += priceMap[item.bottleSize] * item.quantity;
        });

        const deliveryCharge = 50;
        totalPrice += deliveryCharge;

        // Apply promo code if provided
        let discount = 0;
        let validPromoCode = null;
        if (promoCode) {
            validPromoCode = await PromoCode.findOne({
                code: promoCode.toUpperCase(),
                isActive: true,
                validFrom: { $lte: new Date() },
                validUntil: { $gte: new Date() }
            });

            if (validPromoCode) {
                if (validPromoCode.maxUsageCount && validPromoCode.currentUsageCount >= validPromoCode.maxUsageCount) {
                    return res.status(400).json({ msg: 'Promo code usage limit reached' });
                }

                if (totalPrice < validPromoCode.minimumOrderAmount) {
                    return res.status(400).json({
                        msg: `Minimum order amount of ₹${validPromoCode.minimumOrderAmount} required for this promo code`
                    });
                }

                if (validPromoCode.discountType === 'percentage') {
                    discount = (totalPrice * validPromoCode.discountValue) / 100;
                } else {
                    discount = validPromoCode.discountValue;
                }

                validPromoCode.currentUsageCount += 1;
                await validPromoCode.save();
            }
        }

        const finalPrice = totalPrice - discount;

        // Create order
        const order = new Order({
            customerId: req.user.id,
            items,
            deliveryAddress,
            totalPrice: finalPrice,
            deliveryCharge,
            promoCode: promoCode || null,
            discount
        });

        await order.save();

        // Add loyalty points
        const pointsEarned = Math.floor(finalPrice / 10);
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { loyaltyPoints: pointsEarned }
        });

        // Create notification
        const notification = new Notification({
            userId: req.user.id,
            orderId: order._id,
            type: 'order_placed',
            title: 'Order Placed Successfully',
            message: `Your order #${order._id} has been placed successfully. Total: ₹${finalPrice}`
        });
        await notification.save();

        // ✅ Send confirmation email
        const user = await User.findById(req.user.id);
        if (user && user.email) {
            await sendOrderConfirmation(
                user.email,
                user.name,
                order._id.toString(),
                {
                    items: order.items,
                    totalPrice: order.totalPrice,
                    deliveryAddress: order.deliveryAddress
                }
            );
        }

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.to(req.user.id).emit('orderCreated', order);
        }

        res.json({
            msg: 'Order placed successfully',
            order,
            pointsEarned
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Get customer's order history
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.id })
            .populate('assignedWorker', 'name phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Get single order with tracking
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('assignedWorker', 'name phone');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (req.user.role === 'customer' && order.customerId._id.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer)
exports.cancelOrder = async (req, res) => {
    try {
        const { cancellationReason } = req.body;

        const order = await Order.findById(req.params.id)
            .populate('assignedWorker', 'name')
            .populate('customerId', 'name');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (order.customerId._id.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        if (order.status !== 'pending' && order.status !== 'assigned') {
            return res.status(400).json({ msg: 'Cannot cancel order in current status' });
        }

        order.status = 'cancelled';
        order.cancellationReason = cancellationReason;
        await order.save();

        // ✅ Notify customer
        const customerNotification = new Notification({
            userId: req.user.id,
            orderId: order._id,
            type: 'order_cancelled',
            title: 'Order Cancelled',
            message: `Your order #${order._id.toString().slice(-6)} has been cancelled`
        });
        await customerNotification.save();

        // ✅ Notify assigned worker (if any)
        if (order.assignedWorker) {
            const workerNotification = new Notification({
                userId: order.assignedWorker._id,
                orderId: order._id,
                type: 'order_cancelled',
                title: '❌ Order Cancelled',
                message: `Order #${order._id.toString().slice(-6)} was cancelled by customer ${order.customerId.name}`
            });
            await workerNotification.save();

            // Emit socket to worker
            const io = req.app.get('io');
            if (io) {
                io.to(order.assignedWorker._id.toString()).emit('orderCancelled', order);
            }
        }

        // ✅ Notify all admins
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
            const adminNotification = new Notification({
                userId: admin._id,
                orderId: order._id,
                type: 'order_cancelled',
                title: '⚠️ Order Cancelled by Customer',
                message: `Order #${order._id.toString().slice(-6)} cancelled by ${order.customerId.name}. Reason: ${cancellationReason || 'Not provided'}`
            });
            await adminNotification.save();
        }

        const io = req.app.get('io');
        if (io) {
            io.to(req.user.id).emit('orderCancelled', order);
        }

        res.json({ msg: 'Order cancelled successfully', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};


// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Worker)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email')
            .populate('assignedWorker', 'name');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (req.user.role === 'worker' && order.assignedWorker && order.assignedWorker._id.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        order.status = status;

        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        await order.save();

        // Create notification for customer
        const notificationMessages = {
            'assigned': 'Your order has been assigned to a delivery worker',
            'in-transit': 'Your order is on the way',
            'delivered': 'Your order has been delivered successfully'
        };

        if (notificationMessages[status]) {
            const notification = new Notification({
                userId: order.customerId._id,
                orderId: order._id,
                type: `order_${status.replace('-', '_')}`,
                title: 'Order Status Update',
                message: notificationMessages[status]
            });
            await notification.save();
        }

        // ✅ Send status update email
        if (order.customerId && order.customerId.email) {
            await sendOrderStatusUpdate(
                order.customerId.email,
                order.customerId.name,
                order._id.toString(),
                status,
                order.assignedWorker ? order.assignedWorker.name : null
            );
        }

        const io = req.app.get('io');
        if (io) {
            io.to(order.customerId._id.toString()).emit('orderStatusUpdated', order);
        }

        res.json({ msg: 'Order status updated', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = exports;
