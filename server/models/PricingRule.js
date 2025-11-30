const mongoose = require('mongoose');

const PricingRuleSchema = new mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    ruleType: {
        type: String,
        enum: ['distance_based', 'zone_based', 'flat_rate'],
        required: true
    },
    // For distance-based pricing
    distanceRanges: [{
        minDistance: { type: Number }, // in km
        maxDistance: { type: Number }, // in km
        charge: { type: Number, required: true }
    }],
    // For zone-based pricing
    zones: [{
        zoneName: String,
        areas: [String], // Array of area/neighborhood names
        charge: { type: Number, required: true }
    }],
    // For flat rate
    flatCharge: {
        type: Number
    },
    // Base product pricing
    productPricing: [{
        bottleSize: { type: String, required: true },
        pricePerUnit: { type: Number, required: true }
    }],
    minimumOrderCharge: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    effectiveFrom: {
        type: Date,
        default: Date.now
    },
    effectiveUntil: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PricingRule', PricingRuleSchema);
