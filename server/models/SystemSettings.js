const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
    orderingEnabled: { type: Boolean, default: true },
    maintenanceMessage: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
