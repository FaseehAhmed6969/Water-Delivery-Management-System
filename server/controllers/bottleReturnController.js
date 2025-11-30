const BottleReturn = require('../models/BottleReturn');

// Record bottle return
exports.recordReturn = async (req, res) => {
    try {
        const { orderId, bottleSize, quantity, returnType, notes } = req.body;

        const bottleReturn = new BottleReturn({
            orderId,
            customerId: req.user.id,
            workerId: req.body.workerId,
            bottleSize,
            quantity,
            returnType,
            notes
        });

        await bottleReturn.save();
        res.json({ msg: 'Bottle return recorded', bottleReturn });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get inventory tracking (Admin)
exports.getInventoryReport = async (req, res) => {
    try {
        const returns = await BottleReturn.find()
            .populate('customerId', 'name')
            .populate('workerId', 'name')
            .sort({ returnedAt: -1 });

        const summary = returns.reduce((acc, ret) => {
            const key = `${ret.bottleSize}_${ret.returnType}`;
            acc[key] = (acc[key] || 0) + ret.quantity;
            return acc;
        }, {});

        res.json({ returns, summary });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = exports;
