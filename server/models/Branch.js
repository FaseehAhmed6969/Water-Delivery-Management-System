const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  address: { 
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: { 
      type: String, 
      enum: ['Point'], 
      default: 'Point' 
    },
    coordinates: { 
      type: [Number], // [longitude, latitude]
      required: true 
    }
  },
  phone: { 
    type: String 
  },
  email: { 
    type: String 
  },
  managerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  serviceRadius: { 
    type: Number, // in kilometers
    default: 10 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  workingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  inventory: [{
    bottleSize: String,
    quantity: Number,
    lastUpdated: Date
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Geospatial index for location-based queries
BranchSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Branch', BranchSchema);
