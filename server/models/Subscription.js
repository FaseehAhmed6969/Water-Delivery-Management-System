const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    frequency: { type: String, enum: ['weekly', 'monthly'], required: true },
    items: [{ bottleSize: String, quantity: Number }],
    deliveryAddress: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    nextDeliveryDate: { type: Date },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
