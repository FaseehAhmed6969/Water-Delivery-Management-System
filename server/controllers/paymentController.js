const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Create payment
exports.createPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, transactionId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        const payment = new Payment({
            orderId,
            customerId: req.user.id,
            amount: order.totalPrice,
            paymentMethod,
            transactionId,
            status: paymentMethod === 'COD' ? 'pending' : 'completed',
            paidAt: paymentMethod !== 'COD' ? new Date() : null
        });

        await payment.save();

        // Update order with payment info
        order.paymentStatus = payment.status;
        order.paymentMethod = paymentMethod;
        await order.save();

        res.json({ msg: 'Payment recorded successfully', payment });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get revenue report (Admin - US-28)
exports.getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const filter = {
            status: 'completed',
            paidAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        const payments = await Payment.find(filter).populate('orderId customerId');

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        const byMethod = payments.reduce((acc, p) => {
            acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
            return acc;
        }, {});

        res.json({
            totalRevenue,
            paymentCount: payments.length,
            byMethod,
            payments
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = exports;
