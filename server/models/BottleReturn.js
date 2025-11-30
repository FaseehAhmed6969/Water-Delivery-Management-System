const mongoose = require('mongoose');

const BottleReturnSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bottleSize: { type: String, required: true },
    quantity: { type: Number, required: true },
    returnType: { type: String, enum: ['empty', 'damaged', 'rejected'], required: true },
    notes: { type: String },
    returnedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BottleReturn', BottleReturnSchema);
