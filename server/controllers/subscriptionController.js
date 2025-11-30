const Subscription = require('../models/Subscription');
const Order = require('../models/Order');

// Create subscription
exports.createSubscription = async (req, res) => {
    try {
        const { frequency, items, deliveryAddress } = req.body;

        const subscription = new Subscription({
            customerId: req.user.id,
            frequency,
            items,
            deliveryAddress,
            nextDeliveryDate: calculateNextDelivery(frequency)
        });

        await subscription.save();
        res.json({ msg: 'Subscription created successfully', subscription });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get my subscriptions
exports.getMySubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ customerId: req.user.id });
        res.json(subscriptions);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ msg: 'Subscription not found' });
        }

        if (subscription.customerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        subscription.isActive = false;
        subscription.endDate = new Date();
        await subscription.save();

        res.json({ msg: 'Subscription cancelled', subscription });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

function calculateNextDelivery(frequency) {
    const now = new Date();
    if (frequency === 'weekly') {
        now.setDate(now.getDate() + 7);
    } else {
        now.setMonth(now.getMonth() + 1);
    }
    return now;
}

module.exports = exports;
