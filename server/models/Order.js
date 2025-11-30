const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        bottleSize: { type: String, required: true },
        quantity: { type: Number, required: true }
    }],
    deliveryAddress: { type: String, required: true },

    // ✅ NEW: Time Slot field
    timeSlot: {
        type: String,
        enum: ['anytime', 'morning', 'afternoon', 'evening', 'night'],
        default: 'anytime'
    },

    status: {
        type: String,
        enum: ['pending', 'assigned', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    assignedWorker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    totalPrice: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    promoCode: { type: String },
    discount: { type: Number, default: 0 },
    cancellationReason: { type: String },
    createdAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date }
});

module.exports = mongoose.model('Order', OrderSchema);
