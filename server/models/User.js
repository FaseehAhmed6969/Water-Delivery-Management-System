const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['customer', 'admin', 'worker'],
        default: 'customer'
    },
    phone: { type: String },
    address: { type: String },
    loyaltyPoints: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
